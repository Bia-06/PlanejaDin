import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { DEFAULT_CATEGORIES } from '../config/constants'; // Importante para o fallback

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados novos
  const [reminders, setReminders] = useState([]);
  const [categories, setCategories] = useState([]); // Começa vazio
  const [remindersLoading, setRemindersLoading] = useState(true);

  // --- 1. TRANSAÇÕES ---
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

  // --- 2. CATEGORIAS ---
  const fetchCategories = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        // Se o usuário tem categorias no banco, usa elas
        setCategories(data);
      } else {
        // Se não tem nada no banco, usa as PADRÃO do sistema (apenas visualmente)
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
      // Adiciona na lista visual imediatamente
      setCategories(prev => [...prev, data[0]]);
    }
    return { error };
  };

  const deleteCategory = async (id) => {
    // Se for categoria padrão (id começa com 'def-'), apenas remove da tela
    if (id.toString().startsWith('def-')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      return { error: null };
    }

    // Se for do banco, deleta lá
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  // --- 3. LEMBRETES ---
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
    if (!error) setTransactions(prev => [data[0], ...prev]);
    return { data, error };
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
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

  // Carrega tudo ao iniciar
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
    deleteTransaction, 
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