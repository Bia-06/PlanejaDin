import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { DEFAULT_CATEGORIES } from '../config/constants'; 

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [reminders, setReminders] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [remindersLoading, setRemindersLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        setCategories(data);
      } else {
        // Garante que categorias padrão tenham array vazio para evitar erro
        setCategories(DEFAULT_CATEGORIES.map((cat, i) => ({ id: `def-${i}`, name: cat, subcategories: [] })));
      }
    } catch (err) {
      console.error("Erro categorias:", err);
    }
  };

  const addCategory = async (name) => {
    // Inicia com subcategories vazio
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, user_id: userId, subcategories: [] }])
      .select();
    
    if (!error) {
      setCategories(prev => [...prev, data[0]]);
    }
    return { error };
  };

  // --- NOVA FUNÇÃO PARA ATUALIZAR CATEGORIA (Salvar Subcategorias) ---
// Substitua a função updateCategory antiga por esta nova:
  const updateCategory = async (id, updates) => {
    try {
      // CENÁRIO 1: É uma categoria padrão (ex: def-0)?
      // Se for, precisamos CRIAR ela no banco antes de adicionar a subcategoria
      if (id.toString().startsWith('def-')) {
         const categoryName = categories.find(c => c.id === id)?.name;
         if (!categoryName) throw new Error("Categoria original não encontrada.");

         // Insere no banco já com as subcategorias novas
         const { data, error } = await supabase
           .from('categories')
           .insert([{ 
              name: categoryName, 
              user_id: userId, 
              subcategories: updates.subcategories || [] 
           }])
           .select();

         if (error) throw error;

         // Atualiza a lista local trocando a "falsa" pela "nova real"
         if (data) {
            setCategories(prev => prev.map(c => c.id === id ? data[0] : c));
         }
         return { data, error: null };
      }

      // CENÁRIO 2: É uma categoria normal (já existe no banco)
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;

      if (data) {
          setCategories(prev => prev.map(c => c.id === id ? data[0] : c));
      }
      return { data, error: null };

    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.message);
      // Retornamos um objeto de erro padronizado para o front não dar "undefined"
      return { data: null, error: { message: error.message || "Erro desconhecido" } };
    }
  };

  const deleteCategory = async (id) => {
    if (id.toString().startsWith('def-')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      return { error: null };
    }
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  const fetchReminders = async () => {
    if (!userId) return;
    try {
      setRemindersLoading(true);
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error.message);
    } finally {
      setRemindersLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    const { data, error } = await supabase.from('transactions').insert([transactionData]).select();
    if (!error) setTransactions(prev => [data[0], ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    return { data, error };
  };

  const updateTransaction = async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (!error && data) {
        setTransactions(prev => prev.map(t => t.id === id ? data[0] : t));
    }
    return { data, error };
  };

  const updateTransactionGroup = async (groupId, updates) => {
    const { id, date, ...safeUpdates } = updates;
    
    const { data, error } = await supabase
      .from('transactions')
      .update(safeUpdates)
      .eq('group_id', groupId)
      .eq('user_id', userId) 
      .select();

    if (!error && data) {
       setTransactions(prev => prev.map(t => {
           if (t.group_id === groupId) {
               return { ...t, ...safeUpdates };
           }
           return t;
       }));
    }
    return { data, error };
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
    return { error };
  };

  const deleteTransactions = async (ids) => {
    const { error } = await supabase.from('transactions').delete().in('id', ids);
    if (!error) {
        setTransactions(prev => prev.filter(t => !ids.includes(t.id)));
    }
    return { error };
  };

  const updateTransactionStatus = async (id, newStatus) => {
    const { error } = await supabase.from('transactions').update({ status: newStatus }).eq('id', id);
    if (!error) setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    return { error };
  };

  const addReminder = async (reminderData) => {
    const { data, error } = await supabase.from('reminders').insert([{ ...reminderData, user_id: userId }]).select();
    if (!error) setReminders(prev => [...prev, data[0]]);
    return { data, error };
  };

  const updateReminder = async (id, updates) => {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .select();

    if (!error && data) {
      setReminders(prev => prev.map(r => r.id === id ? data[0] : r));
    }
    return { data, error };
  };

  const deleteReminder = async (id) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (!error) setReminders(prev => prev.filter(r => r.id !== id));
    return { error };
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchReminders();
      fetchCategories();
    }
  }, [userId]);

  return { 
    transactions,
    reminders,
    categories,
    loading: loading || remindersLoading,
    addTransaction,
    updateTransaction,
    updateTransactionGroup,
    deleteTransaction,
    deleteTransactions, 
    updateTransactionStatus,
    addReminder,
    updateReminder, 
    deleteReminder,
    addCategory,
    deleteCategory,
    updateCategory, // Exportando a nova função
    fetchTransactions,
    fetchReminders,
    fetchCategories
  };
};