import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { DEFAULT_CATEGORIES } from '../config/constants'; 

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [reminders, setReminders] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [paymentMethods, setPaymentMethods] = useState([]); 
  const [remindersLoading, setRemindersLoading] = useState(true);

  // ... (fetchTransactions permanece igual)
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

  // ... (fetchCategories permanece igual)
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
        setCategories(DEFAULT_CATEGORIES.map((cat, i) => ({ id: `def-${i}`, name: cat, subcategories: [], color: '#2DD4BF' })));
      }
    } catch (err) {
      console.error("Erro categorias:", err);
    }
  };

  // ... (fetchPaymentMethods permanece igual)
  const fetchPaymentMethods = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (!error && data) {
         setPaymentMethods(data);
      }
    } catch (err) {
      console.error("Erro payment methods:", err);
    }
  };

  const addPaymentMethod = async (name, color = '#2DD4BF') => {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{ name, user_id: userId, color }])
      .select();
    
    if (!error && data) {
      setPaymentMethods(prev => [...prev, data[0]]);
    }
    return { error };
  };

  // --- NOVA FUNÇÃO ADICIONADA: Atualizar Pagamento (Nome ou Cor) ---
  const updatePaymentMethod = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from('payment_methods')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data) {
            setPaymentMethods(prev => prev.map(p => p.id === id ? data[0] : p));
        }
        return { data, error: null };
    } catch (error) {
        console.error("Erro ao atualizar forma de pagamento:", error);
        return { error };
    }
  };

  const deletePaymentMethod = async (id) => {
    const { error } = await supabase.from('payment_methods').delete().eq('id', id);
    if (!error) {
      setPaymentMethods(prev => prev.filter(p => p.id !== id));
    }
    return { error };
  };

  const addCategory = async (name, color = '#2DD4BF') => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, user_id: userId, subcategories: [], color }])
      .select();
    
    if (!error) {
      setCategories(prev => [...prev, data[0]]);
    }
    return { error };
  };

  const updateCategory = async (id, updates) => {
    try {
      if (id.toString().startsWith('def-')) {
         const cat = categories.find(c => c.id === id);
         if (!cat) throw new Error("Categoria não encontrada.");

         const { data, error } = await supabase
           .from('categories')
           .insert([{ 
              name: cat.name, 
              user_id: userId, 
              subcategories: updates.subcategories || cat.subcategories,
              color: updates.color || cat.color || '#2DD4BF'
           }])
           .select();

         if (error) throw error;
         if (data) setCategories(prev => prev.map(c => c.id === id ? data[0] : c));
         return { data, error: null };
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      if (data) setCategories(prev => prev.map(c => c.id === id ? data[0] : c));
      return { data, error: null };

    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.message);
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

  // ... (Restante das funções de Transação e Lembretes permanecem iguais)
  const fetchReminders = async () => { /*...*/ if(!userId) return; try{ setRemindersLoading(true); const {data, error} = await supabase.from('reminders').select('*').eq('user_id', userId).order('date', {ascending:true}); if(error) throw error; setReminders(data||[]); } catch(e){ console.error(e) } finally{ setRemindersLoading(false) } };
  const addTransaction = async (t) => { const {data, error} = await supabase.from('transactions').insert([t]).select(); if(!error) setTransactions(p => [data[0], ...p].sort((a,b)=>new Date(b.date)-new Date(a.date))); return {data, error} };
  const updateTransaction = async (id, u) => { const {data, error} = await supabase.from('transactions').update(u).eq('id', id).select(); if(!error && data) setTransactions(p => p.map(t => t.id === id ? data[0] : t)); return {data, error} };
  const updateTransactionGroup = async (gid, u) => { const {id, date, ...safe} = u; const {data, error} = await supabase.from('transactions').update(safe).eq('group_id', gid).eq('user_id', userId).select(); if(!error) fetchTransactions(); return {data, error} };
  const deleteTransaction = async (id) => { const {error} = await supabase.from('transactions').delete().eq('id', id); if(!error) setTransactions(p => p.filter(t => t.id !== id)); return {error} };
  const deleteTransactions = async (ids) => { const {error} = await supabase.from('transactions').delete().in('id', ids); if(!error) setTransactions(p => p.filter(t => !ids.includes(t.id))); return {error} };
  const updateTransactionStatus = async (id, s) => { const {error} = await supabase.from('transactions').update({status:s}).eq('id', id); if(!error) setTransactions(p => p.map(t => t.id === id ? {...t, status:s} : t)); return {error} };
  const addReminder = async (r) => { const {data, error} = await supabase.from('reminders').insert([{...r, user_id: userId}]).select(); if(!error) setReminders(p => [...p, data[0]]); return {data, error} };
  const updateReminder = async (id, u) => { const {data, error} = await supabase.from('reminders').update(u).eq('id', id).select(); if(!error && data) setReminders(p => p.map(r => r.id === id ? data[0] : r)); return {data, error} };
  const deleteReminder = async (id) => { const {error} = await supabase.from('reminders').delete().eq('id', id); if(!error) setReminders(p => p.filter(r => r.id !== id)); return {error} };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchReminders();
      fetchCategories();
      fetchPaymentMethods();
    }
  }, [userId]);

  return { 
    transactions, reminders, categories, paymentMethods,
    loading: loading || remindersLoading,
    addTransaction, updateTransaction, updateTransactionGroup, deleteTransaction, deleteTransactions, updateTransactionStatus,
    addReminder, updateReminder, deleteReminder,
    addCategory, deleteCategory, updateCategory,
    addPaymentMethod, deletePaymentMethod, updatePaymentMethod, // <--- EXPORTANDO A NOVA FUNÇÃO
    fetchTransactions, fetchReminders, fetchCategories
  };
};