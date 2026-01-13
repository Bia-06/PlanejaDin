import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useSupabase';
import AuthModal from './components/AuthModal'; 
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView'; 
import ReportsView from './components/ReportsView';
import RemindersView from './components/RemindersView';
import CalendarView from './components/CalendarView';
import SettingsView from './components/SettingsView';
import CategoriesView from './components/CategoriesView'; 
import MoreView from './components/MoreView'; 
import Modal from './components/UI/Modal';
import Input from './components/UI/Input';
import Select from './components/UI/Select';
import Button from './components/UI/Button';
import Logo from './components/UI/Logo';
import LandingPage from './components/LandingPage';
import NotificationBell from './components/NotificationBell'; 

import { useTransactions } from './hooks/useTransactions';

import { 
  LayoutDashboard, List, FileText, Bell, CalendarIcon, Settings, Repeat, Layers, Menu, Tag, CalendarDays
} from 'lucide-react';

import { 
  parseCommaValue, getLocalDateString, formatValueForInput, 
  handleAmountInputChange 
} from './utils/formatters';

export default function App() {

  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const { user: authUser, loading: authLoading, signOut } = useAuth();
  const [view, setView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('transaction');
  const [transactionType, setTransactionType] = useState('expense');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editScope, setEditScope] = useState('single');
  
  const [resetMoreKey, setResetMoreKey] = useState(0);
 
  const DEBUG_MODE = false; 
  let user = authUser;
  let loading = authLoading;

  if (DEBUG_MODE && !user && !loading) {
    user = {
      id: 'dev-user-' + Date.now(),
      email: 'dev@test.com',
      user_metadata: { name: 'Desenvolvedor', phone: '11999999999', address: 'Rua Exemplo, 123' }
    };
    loading = false;
  }

  const { 
    transactions, 
    reminders, 
    categories,
    paymentMethods, 
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
    updateCategory, 
    deleteCategory,
    addPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod 
  } = useTransactions(user?.id);

  const [form, setForm] = useState({
    description: '', 
    amount: '', 
    type: 'expense', 
    category: '', 
    subcategory: '', 
    paymentMethod: '', 
    date: getLocalDateString(), 
    status: 'pending', 
    recurrence: '', 
    installments: 2, 
    group_id: null
  });

  const [formErrors, setFormErrors] = useState({});
  const [reminderForm, setReminderForm] = useState({ title: '', date: getLocalDateString(), details: '' });
  
  const [filters, setFilters] = useState(() => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    
    return { 
        type: 'all', 
        category: 'all', 
        status: 'all', 
        startDate: firstDay, 
        endDate: lastDay,    
        minAmount: '', 
        maxAmount: '' 
    };
  });

  useEffect(() => {
    const currentCatObj = categories.find(c => c.name === form.category);
    if (currentCatObj && form.subcategory) {
        if (!currentCatObj.subcategories || !currentCatObj.subcategories.includes(form.subcategory)) {
            setForm(prev => ({ ...prev, subcategory: '' }));
        }
    }
  }, [form.category, categories, form.subcategory]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      if (signOut && typeof signOut === 'function') {
        await signOut();
        setShowAuthScreen(false);
        console.log('Logout realizado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }));

  const paymentMethodOptions = paymentMethods.map(method => ({
    value: method.name,
    label: method.name
  }));

  const todayStr = getLocalDateString();
  const now = new Date();
  const currentMonth = now.getMonth() + 1; 
  const currentYear = now.getFullYear();

  const isCurrentMonth = (dateString) => {
    if (!dateString) return false;
    const [year, month] = dateString.split('-').map(Number);
    return year === currentYear && month === currentMonth;
  };

  const summary = {
    income: transactions
      .filter(t => t.type === 'income' && t.status === 'paid' && isCurrentMonth(t.date))
      .reduce((acc, curr) => acc + curr.amount, 0),
    
    expense: transactions
      .filter(t => t.type === 'expense' && t.status === 'paid' && isCurrentMonth(t.date))
      .reduce((acc, curr) => acc + curr.amount, 0),
    
    balance: 0,
    
    pendingBills: transactions
      .filter(t => t.type === 'expense' && t.status === 'pending' && t.date <= todayStr)
      .reduce((acc, curr) => acc + curr.amount, 0)
  };
  summary.balance = summary.income - summary.expense;

  const getChartData = () => {
    const expenses = transactions.filter(t => t.type === 'expense' && isCurrentMonth(t.date));
    const totalsByCategory = expenses.reduce((acc, curr) => {
      const cat = curr.category || 'Outros';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {});
    const sortedData = Object.entries(totalsByCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    if (sortedData.length <= 5) return sortedData;
    const top5 = sortedData.slice(0, 5);
    const othersValue = sortedData.slice(5).reduce((acc, curr) => acc + curr.value, 0);
    return [...top5, { name: 'Outros', value: othersValue }];
  };
  const chartDataArray = getChartData();

  const openModal = (type, subType = 'expense', dataToEdit = null) => {
    setModalType(type);
    setEditScope('single'); 

    if (type === 'transaction') {
      setTransactionType(subType);
      
      if (dataToEdit) {
        setEditingId(dataToEdit.id);
        setForm({
          description: dataToEdit.description,
          amount: Number(dataToEdit.amount).toFixed(2).replace('.', ','),
          type: dataToEdit.type,
          category: dataToEdit.category || 'Outros',
          subcategory: dataToEdit.subcategory || '',
          paymentMethod: dataToEdit.payment_method || '', 
          date: dataToEdit.date,
          status: dataToEdit.status,
          recurrence: '', 
          installments: 2,
          group_id: dataToEdit.group_id 
        });
      } else {
        setEditingId(null);
        setForm({
            description: '', 
            amount: '', 
            type: subType, 
            category: '', 
            subcategory: '',
            paymentMethod: '', 
            date: getLocalDateString(), 
            status: 'pending', 
            recurrence: '', 
            installments: 2, 
            group_id: null
        });
      }
    } 
    else if (type === 'reminder') {
        if (dataToEdit) {
            setEditingId(dataToEdit.id);
            setReminderForm({
                title: dataToEdit.title,
                date: dataToEdit.date,
                details: dataToEdit.details || ''
            });
        } else {
            setEditingId(null);
            setReminderForm({ title: '', date: getLocalDateString(), details: '' });
        }
    }
    
    setIsModalOpen(true);
  };

  const resetForms = () => {
    setForm({ 
      description: '', 
      amount: '', 
      type: 'expense', 
      category: '', 
      subcategory: '', 
      paymentMethod: '', 
      date: getLocalDateString(), 
      status: 'pending', 
      recurrence: '', 
      installments: 2, 
      group_id: null 
    });
    setReminderForm({ title: '', date: getLocalDateString(), details: '' });
    setFormErrors({});
    setEditingId(null);
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount || !form.category || !form.paymentMethod) {
        alert("Por favor, preencha todos os campos obrigatórios (Descrição, Valor, Categoria e Forma de Pagamento).");
        return;
    }
    setActionLoading(true);
    const baseAmount = parseCommaValue(form.amount);

    try {
      if (editingId) {
        if (editScope === 'all' && form.group_id) {
            await updateTransactionGroup(form.group_id, {
                description: form.description,
                amount: baseAmount,
                type: form.type,
                category: form.category,
                subcategory: form.subcategory,
                payment_method: form.paymentMethod, 
            });
        } else {
            await updateTransaction(editingId, {
                description: form.description,
                amount: baseAmount,
                type: form.type,
                category: form.category,
                subcategory: form.subcategory,
                payment_method: form.paymentMethod, 
                date: form.date,
                status: form.status
            });
        }
      } 
      else {
        let loopCount = 1;
        if (form.recurrence === 'weekly') loopCount = 12; 
        if (form.recurrence === 'fixed') loopCount = 12; 
        if (form.recurrence === 'installment') loopCount = parseInt(form.installments);
        const [year, month, day] = form.date.split('-').map(Number);
        let newGroupId = null;
        if (loopCount > 1) {
            newGroupId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        }

        for (let i = 0; i < loopCount; i++) {
          let currentDate;
          if (form.recurrence === 'weekly') {
             currentDate = new Date(year, month - 1, day);
             currentDate.setDate(currentDate.getDate() + (i * 7));
          } else {
             currentDate = new Date(year, month - 1 + i, day);
          }
          const dateString = getLocalDateString(currentDate);
          let description = form.description;
          if (form.recurrence === 'installment') description = `${form.description} (${i + 1}/${loopCount})`;
          let status = i === 0 ? form.status : 'pending';
          const transactionAmount = form.recurrence === 'installment' ? parseFloat((baseAmount / loopCount).toFixed(2)) : baseAmount;
          await addTransaction({ 
              description, 
              amount: transactionAmount, 
              type: form.type, 
              category: form.category, 
              subcategory: form.subcategory,
              payment_method: form.paymentMethod, 
              date: dateString, 
              status, 
              user_id: user.id, 
              group_id: newGroupId 
          });
        }
      }
      setIsModalOpen(false);
      resetForms();
    } catch (err) { console.error(err); } finally { setActionLoading(false); }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingId) {
          await updateReminder(editingId, { 
              title: reminderForm.title, 
              date: reminderForm.date, 
              details: reminderForm.details 
          });
      } else {
          await addReminder({ 
              title: reminderForm.title, 
              date: reminderForm.date, 
              details: reminderForm.details 
          });
      }
      setIsModalOpen(false);
      resetForms();
    } catch (err) { console.error(err); } finally { setActionLoading(false); }
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("Excluir item?")) {
      if (collectionName === 'transactions') await deleteTransaction(id);
      else if (collectionName === 'reminders') await deleteReminder(id);
    }
  };

  const handleBatchDelete = async (ids) => {
    if (window.confirm(`Tem certeza que deseja excluir ${ids.length} itens selecionados?`)) {
        await deleteTransactions(ids);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'paid' ? 'pending' : 'paid';
    await updateTransactionStatus(item.id, newStatus);
  };

  const handleToggleReminder = async (reminder) => {
    const currentStatus = reminder.status || 'pending';
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setActionLoading(true);
    try {
      await updateReminder(reminder.id, { status: newStatus });
    } catch (err) { console.error(err); } finally { setActionLoading(false); }
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView user={user} summary={summary} chartData={chartDataArray} reminders={reminders} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} openModal={openModal} setView={setView} />;
      case 'transactions': 
        return (
            <TransactionsView 
                transactions={transactions} 
                filters={filters} 
                setFilters={setFilters} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                categoryOptions={categoryOptions}
                categories={categories}
                paymentMethods={paymentMethods} 
                openModal={openModal} 
                handleToggleStatus={handleToggleStatus} 
                handleDelete={handleDelete} 
                handleBatchDelete={handleBatchDelete} 
            />
        );
      case 'reports': return <ReportsView transactions={transactions} categories={categories} paymentMethods={paymentMethods} />;
      case 'reminders': return <RemindersView reminders={reminders} handleDelete={handleDelete} openModal={openModal} updateReminder={updateReminder} />;
      case 'calendar': return (
        <div className="w-full overflow-x-auto overflow-y-hidden"> 
          <div className="min-w-[600px] md:min-w-0"> 
            <CalendarView 
              transactions={transactions} 
              reminders={reminders} 
              paymentMethods={paymentMethods} 
              onUpdateTransaction={updateTransaction} 
              onDeleteTransaction={(id) => handleDelete('transactions', id)} 
              onDeleteReminder={(id) => handleDelete('reminders', id)}
              onToggleReminder={handleToggleReminder}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>
      );
      case 'categories': return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-teal dark:text-white font-poppins">Categorias & Pagamentos</h2>
              <CategoriesView 
                categories={categories}
                addCategory={addCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
                paymentMethods={paymentMethods} 
                addPaymentMethod={addPaymentMethod}
                updatePaymentMethod={updatePaymentMethod} 
                deletePaymentMethod={deletePaymentMethod}
                transactions={transactions} 
             />
        </div>
      );
      case 'settings': return <SettingsView user={user} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onLogout={handleLogout} />;
      case 'more': return <MoreView user={user} transactions={transactions} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onLogout={handleLogout} resetKey={resetMoreKey} />;
      default: return <DashboardView />;
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
    { id: 'transactions', icon: List, label: 'Movimentações' },
    { id: 'categories', icon: Tag, label: 'Categorias' }, 
    { id: 'reminders', icon: Bell, label: 'Lembretes' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendário' },
    { id: 'reports', icon: FileText, label: 'Relatórios' },
    { id: 'settings', icon: Settings, label: 'Configurações' }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bgLight dark:bg-gray-900">
        <div className="animate-spin w-10 h-10 border-4 border-mint border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
        <>
            <LandingPage onLoginClick={() => setShowAuthScreen(true)} />
            <AuthModal isOpen={showAuthScreen} onClose={() => setShowAuthScreen(false)} onLogin={() => {}} />
        </>
    );
  }

  return (
    <div className={`h-[100dvh] transition-colors duration-300 font-inter ${isDarkMode ? 'dark bg-gray-900' : 'bg-bgLight'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .dark input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
      `}</style>
      
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
 
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shrink-0 z-20">
            <Logo size="small" />
            <div className="flex items-center gap-3">
                <NotificationBell />
                <div 
                    onClick={() => { setView('more'); setResetMoreKey(prev => prev + 1); }}
                    className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold overflow-hidden border border-gray-200 dark:border-gray-600 cursor-pointer"
                >
                    {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                    ) : ( user?.email?.charAt(0).toUpperCase() )}
                </div>
            </div>
        </header>

        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm z-20">
          <div className="p-8 border-b border-gray-50 dark:border-gray-700">
            <Logo size="large" showSlogan={true} centered={true} className="mb-2" />
          </div>
          
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {menuItems.map(item => (
              <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all font-medium ${view === item.id ? 'bg-mint/10 text-mint font-bold shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-teal'}`}>
                <item.icon className="w-5 h-5" />{item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div 
                  className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-w-0" 
                  onClick={() => setView('settings')}
                >
                  <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                    ) : ( user?.email?.charAt(0).toUpperCase() )}
                  </div>
                  
                  <div className="overflow-hidden text-left">
                    <p className="text-sm font-bold text-teal dark:text-white truncate">
                        {(() => {
                           const name = user?.user_metadata?.name || 'Usuário';
                           const parts = name.trim().split(/\s+/);
                           if (parts.length > 1) {
                               return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
                           }
                           return parts[0];
                        })()}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate flex items-center gap-1.5 mt-0.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint"></span>
                      Plano Gratuito
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                    <NotificationBell variant="sidebar-footer" />
                </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative bg-bgLight dark:bg-gray-900 pb-24 md:pb-0 w-full overflow-x-hidden">
          <div className="max-w-5xl mx-auto p-4 md:p-10">{renderView()}</div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center px-2 py-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
           {menuItems.slice(0, 5).map(item => (
              <button key={item.id} onClick={() => setView(item.id)} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${view === item.id ? 'text-mint' : 'text-gray-400 dark:text-gray-500 hover:text-teal dark:hover:text-gray-300'}`}>
                <item.icon className={`w-6 h-6 ${view === item.id ? 'fill-current opacity-20' : ''}`} strokeWidth={view === item.id ? 2.5 : 2} />
                <span className="text-[10px] font-medium mt-1">{item.label.split(' ')[0]}</span>
              </button>
            ))}
            <button onClick={() => { setView('more'); setResetMoreKey(prev => prev + 1); }} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${view === 'more' ? 'text-mint' : 'text-gray-400 dark:text-gray-500'}`}>
                <Menu className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">Mais</span>
            </button>
        </nav>
      </div>
 
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'transaction' ? (editingId ? "Editar Transação" : (transactionType === 'income' ? "Nova Receita" : "Nova Despesa")) : (editingId ? "Editar Lembrete" : "Novo Lembrete")}>
        {modalType === 'transaction' ? (
          <form onSubmit={handleSaveTransaction} className="space-y-3">
            {!editingId && (
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-2">
                  <button type="button" onClick={() => setForm({...form, type: 'expense'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${form.type === 'expense' ? 'bg-white dark:bg-gray-700 text-red-500 shadow-sm ring-1 ring-black/5' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Despesa</button>
                  <button type="button" onClick={() => setForm({...form, type: 'income'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${form.type === 'income' ? 'bg-white dark:bg-gray-700 text-mint shadow-sm ring-1 ring-black/5' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}>Receita</button>
                </div>
            )}
            <Input label="Descrição" placeholder={form.type === 'income' ? "Ex: Salário, Venda, Reembolso..." : "Ex: Aluguel, Mercado, Uber..."} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required />
            <Input label="Valor (R$)" type="text" placeholder="0,00" value={formatValueForInput(form.amount)} onChange={(e) => setForm({...form, amount: handleAmountInputChange(e.target.value)})} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select label="Categoria" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required={true} options={[{ value: '', label: 'Selecione...' }, ...categoryOptions]} />
              <Select label="Forma de Pagamento" value={form.paymentMethod} onChange={(e) => setForm({...form, paymentMethod: e.target.value})} required={true} options={[{ value: '', label: 'Selecione...' }, ...paymentMethodOptions]} />
            </div>
            {(() => {
                const selectedCatData = categories.find(c => c.name === form.category);
                const hasSubcats = selectedCatData && selectedCatData.subcategories && selectedCatData.subcategories.length > 0;
                if (hasSubcats) {
                    return (
                        <div className="animate-fadeIn">
                            <Select label="Detalhe (Subcategoria)" value={form.subcategory} onChange={(e) => setForm({...form, subcategory: e.target.value})} options={[{ value: '', label: 'Selecione...' }, ...selectedCatData.subcategories.map(sub => ({ value: sub, label: sub }))]} />
                        </div>
                    );
                }
                return null;
            })()}
            <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
            
            {!editingId && (
                <div className="mt-1">
                  <label className="block text-sm font-semibold text-teal dark:text-gray-300 mb-1">Repetição</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setForm({...form, recurrence: form.recurrence === 'weekly' ? '' : 'weekly'})} className={`flex-1 py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${form.recurrence === 'weekly' ? 'bg-mint/10 border-mint text-mint' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}><CalendarDays size={14} /> Semanal</button>
                    <button type="button" onClick={() => setForm({...form, recurrence: form.recurrence === 'fixed' ? '' : 'fixed'})} className={`flex-1 py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${form.recurrence === 'fixed' ? 'bg-mint/10 border-mint text-mint' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}><Repeat size={14} /> Fixa</button>
                    <button type="button" onClick={() => setForm({...form, recurrence: form.recurrence === 'installment' ? '' : 'installment'})} className={`flex-1 py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${form.recurrence === 'installment' ? 'bg-mint/10 border-mint text-mint' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}><Layers size={14} /> Parcelada</button>
                  </div>
                </div>
            )}
            {form.recurrence === 'installment' && !editingId && <Input label="Parcelas" type="number" value={form.installments} onChange={(e) => setForm({...form, installments: e.target.value})} min="2" />}
            {editingId && form.group_id && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800 mb-3 mt-3">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-1"><Repeat className="w-3 h-3" /> Editar:</p>
                    <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="editScope" value="single" checked={editScope === 'single'} onChange={() => setEditScope('single')} className="text-mint focus:ring-mint" /><span className="text-sm text-gray-700 dark:text-gray-300">Apenas este</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="editScope" value="all" checked={editScope === 'all'} onChange={() => setEditScope('all')} className="text-mint focus:ring-mint" /><span className="text-sm text-gray-700 dark:text-gray-300">Fixa/Recorrente</span></label>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-3 mt-1"><input type="checkbox" id="paidCheck" checked={form.status === 'paid'} onChange={(e) => setForm({...form, status: e.target.checked ? 'paid' : 'pending'})} className="w-5 h-5 rounded text-mint cursor-pointer" /><label htmlFor="paidCheck" className="text-sm font-medium text-teal dark:text-gray-300 cursor-pointer">Marcar como já pago/recebido?</label></div>
            <Button type="submit" variant="primary" className="w-full mt-2" disabled={actionLoading}>{actionLoading ? "Processando..." : (editingId ? "Salvar Alterações" : "Confirmar")}</Button>
          </form>
        ) : (
          <form onSubmit={handleAddReminder} className="space-y-4">
            <Input label="Título" placeholder="Ex: Consulta Médica..." value={reminderForm.title} onChange={(e) => setReminderForm({...reminderForm, title: e.target.value})} required />
            <Input label="Data" type="date" value={reminderForm.date} onChange={(e) => setReminderForm({...reminderForm, date: e.target.value})} required />
            <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-teal dark:text-white" rows="3" placeholder="Ex: Local, horário..." value={reminderForm.details} onChange={(e) => setReminderForm({...reminderForm, details: e.target.value})} />
            <Button type="submit" variant="primary" className="w-full" disabled={actionLoading}>{editingId ? "Salvar Alterações" : "Agendar Lembrete"}</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}