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
        setCategories(DEFAULT_CATEGORIES.map((cat, i) => ({ id: `def-${i}`, name: cat })));
      }
    } catch (err) {
      console.error("Erro categorias:", err);
    }
  };

  const addCategory = async (name) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, user_id: userId }])
      .select();
    
    if (!error) {
      setCategories(prev => [...prev, data[0]]);
    }
    return { error };
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

  // Função para atualizar uma única transação
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

  // Função para atualizar grupo (ex: todas as parcelas)
  const updateTransactionGroup = async (groupId, updates) => {
    // Removemos ID e DATA para não sobrepor datas diferentes das parcelas
    const { id, date, ...safeUpdates } = updates;
    
    const { data, error } = await supabase
      .from('transactions')
      .update(safeUpdates)
      .eq('group_id', groupId)
      .eq('user_id', userId) // Segurança extra
      .select();

    if (!error && data) {
       // Atualiza visualmente todas que tem aquele groupId
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

  // --- NOVO: Função para apagar VÁRIOS itens de uma vez ---
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
    deleteTransactions, // <--- EXPORTADO
    updateTransactionStatus,
    addReminder,
    deleteReminder,
    addCategory,
    deleteCategory,
    fetchTransactions,
    fetchReminders,
    fetchCategories
  };
};