import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, CalendarIcon, CheckCircle, 
  Clock, AlertCircle, Star, PieChart, Search, Check, X, Trash2,
  RotateCcw
} from 'lucide-react';
import Card from './UI/Card';
import { formatDate, formatCurrency } from '../utils/formatters';

const CalendarView = ({ 
  transactions = [], 
  reminders = [], 
  paymentMethods = [], 
  onUpdateTransaction,
  onDeleteTransaction, 
  onDeleteReminder,
  onToggleReminder,
  onToggleStatus
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const [searchDayQuery, setSearchDayQuery] = useState('');
  const [paymentModal, setPaymentModal] = useState({ open: false, transaction: null });
  const [selectedMethod, setSelectedMethod] = useState('');

  const fixedHolidays = {
    '1-1': 'Ano Novo',
    '16-2': 'Carnaval',
    '17-2': 'Carnaval',
    '18-2': 'Quarta-Feira de Cinzas',
    '21-4': 'Tiradentes',
    '1-5': 'Dia do Trabalho',
    '4-6': 'Corpus Christi',
    '7-9': 'Independência',
    '12-10': 'N. Sra. Aparecida',
    '2-11': 'Finados',
    '15-11': 'Proclamação da República',
    '20-11': 'Consciência Negra',
    '25-12': 'Natal'
  };

  const checkHoliday = (day, month) => {
    return fixedHolidays[`${day}-${month + 1}`];
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay, year, month };
  };

  const { daysInMonth, startingDay, year, month } = getDaysInMonth();
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const getItemsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const dayReminders = reminders.filter(r => r.date === dateStr);
    return { transactions: dayTransactions, reminders: dayReminders };
  };

const getDayEventsSummary = (day) => {
    const { transactions, reminders } = getItemsForDay(day);
    const hasIncome = transactions.some(t => t.type === 'income');
    const hasPendingExpense = transactions.some(t => t.type === 'expense' && t.status === 'pending');
    const hasPaidExpense = transactions.some(t => t.type === 'expense' && t.status === 'paid');
    const hasReminder = reminders.some(r => r.status !== 'completed');
    
    return { hasIncome, hasPendingExpense, hasPaidExpense, hasReminder };
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getEventsForSelectedDay = (day) => {
    const { transactions, reminders } = getItemsForDay(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { transactions, reminders, date: formatDate(dateStr) };
  };

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const selectedDayEvents = getEventsForSelectedDay(selectedDay);

  const filteredDayTransactions = selectedDayEvents.transactions.filter(t => 
    t.description.toLowerCase().includes(searchDayQuery.toLowerCase()) ||
    (t.category && t.category.toLowerCase().includes(searchDayQuery.toLowerCase()))
  );

const categorySummary = useMemo(() => {
    const summary = {};
    selectedDayEvents.transactions.forEach(t => {
      const catName = t.category || 'Outros';
      if (!summary[catName]) {
        summary[catName] = { 
            name: catName, 
            total: 0, 
            type: t.type, 
            count: 0,
            hasPending: false 
        };
      }
      summary[catName].total += Number(t.amount);
      summary[catName].count += 1;
      if (t.type === 'expense' && t.status === 'pending') {
          summary[catName].hasPending = true;
      }
    });
    return Object.values(summary).sort((a, b) => b.total - a.total);
  }, [selectedDayEvents.transactions]);

  const handleOpenPayModal = (transaction) => {
      const initialMethod = transaction.payment_method || (paymentMethods.length > 0 ? paymentMethods[0].name : '');
      setSelectedMethod(initialMethod);
      setPaymentModal({ open: true, transaction });
  };

  const handleConfirmPay = async () => {
      if (paymentModal.transaction && onUpdateTransaction) {
          await onUpdateTransaction(paymentModal.transaction.id, {
              status: 'paid',
              payment_method: selectedMethod
          });
          setPaymentModal({ open: false, transaction: null });
      }
  };

    const confirmDeleteTransaction = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta movimentação?")) {
        if (onDeleteTransaction) onDeleteTransaction(id);
    }
  };

  const confirmDeleteReminder = (id) => {
    if (window.confirm("Excluir este lembrete?")) {
        if (onDeleteReminder) onDeleteReminder(id);
    }
  };

  const getTransactionStyle = (t) => {
      if (t.type === 'income') {
          return {
              bg: 'bg-mint/10',
              text: 'text-mint',
              border: 'border-mint/20',
              iconBg: 'bg-mint/10 text-mint',
              icon: <PieChart size={20} />
          };
      }
      if (t.type === 'expense') {
          if (t.status === 'pending') {
              return {  
                  bg: 'bg-red-50 dark:bg-red-900/10',
                  text: 'text-red-500',
                  border: 'border-red-100 dark:border-red-900/30',
                  iconBg: 'bg-red-100 text-red-500',
                  icon: <Clock size={20} />
              };
          } else {
              return {
                  bg: 'bg-gray-50 dark:bg-gray-800',
                  text: 'text-gray-500 dark:text-gray-400',
                  border: 'border-gray-100 dark:border-gray-700',
                  iconBg: 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
                  icon: <CheckCircle size={20} />
              };
          }
      }
      return {};
  };

  return (
    <div className="animate-fadeIn pb-24 font-inter space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins">Calendário & Agenda</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie suas movimentações</p>
        </div>
        
        <div className="flex flex-col-reverse md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
          <button 
            onClick={() => {
                const now = new Date();
                setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                setSelectedDay(now.getDate());
            }}
            className="w-full md:w-auto px-4 py-2 bg-mint hover:bg-[#00b57a] text-white rounded-xl font-medium transition-colors text-sm shadow-sm"
          >
            Hoje
          </button>
          
          <div className="flex items-center justify-between w-full md:w-auto bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-teal dark:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-2 md:px-4 font-bold text-teal dark:text-white capitalize min-w-[140px] md:min-w-[180px] text-center text-sm md:text-base">
              {monthName}
            </span>
            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-teal dark:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <Card className="p-3 md:p-6 h-full">
            <div className="grid grid-cols-7 text-center mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-gray-400 font-bold text-xs md:text-sm py-2">
                  {day.slice(0, 3)} 
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[60px] md:min-h-[100px] bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-transparent" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = day === selectedDay;
                const events = getDayEventsSummary(day);
                const holidayName = checkHoliday(day, month);
                
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDay(day); setSearchDayQuery(''); }}
                    className={`min-h-[60px] md:min-h-[100px] rounded-lg flex flex-col items-center md:items-start justify-start p-1 md:p-2 transition-all border relative
                      ${isToday ? 'border-mint ring-1 ring-mint bg-mint/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
                      ${isSelected ? 'ring-2 ring-teal border-teal dark:ring-black  z-10 shadow-md transform scale-[1.02]' : 'hover:border-teal/50 hover:shadow-sm'}
                    `}
                  >
                    <div className="flex justify-between items-start w-full mb-1">
                      <span className={`text-xs md:text-sm font-bold ${isToday ? 'text-mint' : 'text-gray-700 dark:text-gray-300'}`}>{day}</span>
                      {holidayName && <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow fill-yellow" />}
                    </div>

                    <div className="flex gap-1 mb-1 md:mb-2 justify-center md:justify-start w-full">
                      {events.hasIncome && <div className="w-1.5 h-1.5 rounded-full bg-mint" title="Receita"></div>}
                      {events.hasExpense && <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Despesa"></div>}
                      {events.hasPending && <div className="w-1.5 h-1.5 rounded-full bg-yellow" title="Pendente"></div>}
                      {events.hasReminder && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Lembrete"></div>}
                    </div>
        
                    <div className="w-full space-y-1 overflow-hidden hidden md:block">
                      {holidayName && (
                          <div className="text-[10px] px-1 py-0.5 rounded truncate w-full text-left bg-yellow/10 text-yellow-600 border border-yellow/20 font-bold dark:text-yellow dark:border-yellow-300/30 dark:bg-yellow-400/10">
                            {holidayName}
                          </div>
                      )}
                      {getItemsForDay(day).transactions.slice(0, holidayName ? 1 : 2).map((t) => (
                        <div key={t.id} className={`text-[10px] px-1 py-0.5 rounded truncate w-full text-left border ${
                            t.type === 'income' ? 'bg-mint/10 text-mint border-mint/20' : 
                            t.status === 'pending' ? 'bg-red-50 text-red-500 border-red-100 dark:bg-red-900/20 dark:border-red-800' : 
                            'bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600' 
                          }`}>
                          {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-4 md:p-6 sticky top-6 h-fit">
            <h4 className="font-bold text-lg text-teal dark:text-white mb-3 md:mb-5 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-mint" />
                Legenda
            </h4>
            
            {/* CORREÇÃO: Grid no mobile para ocupar menos espaço vertical */}
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-1.5 md:p-2 bg-yellow/10 rounded-lg"><Star className="w-4 h-4 md:w-5 md:h-5 text-yellow fill-yellow"/></div>
                <p className="font-bold text-xs md:text-sm text-gray-700 dark:text-gray-200">Feriado</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-mint/10 flex items-center justify-center"><div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-mint"></div></div>
                <p className="font-bold text-xs md:text-sm text-gray-700 dark:text-gray-200">Receita</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-red-500/10 flex items-center justify-center"><div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500"></div></div>
                <p className="font-bold text-xs md:text-sm text-gray-700 dark:text-gray-200">Pendente</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gray-200 flex items-center justify-center"><div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-500"></div></div>
                <p className="font-bold text-xs md:text-sm text-gray-700 dark:text-gray-200">Pago</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                 <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-purple-500/10 flex items-center justify-center"><div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500"></div></div>
                <p className="font-bold text-xs md:text-sm text-gray-700 dark:text-gray-200">Lembrete</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[10px] md:text-xs text-center text-gray-400">
                    Selecione um dia no calendário.
                </p>
            </div>
          </Card>
        </div>
      </div>
      <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-mint/10 rounded-xl shrink-0">
                        <CalendarIcon className="w-6 h-6 text-mint" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-teal dark:text-white leading-tight">Agenda de {selectedDayEvents.date}</h3>
                        {checkHoliday(selectedDay, month) && (
                           <p className="text-xs font-bold text-yellow-600 dark:text-yellow flex items-center gap-1 mt-0.5">
                             <Star size={10} className="fill-yellow" /> {checkHoliday(selectedDay, month)}
                           </p>
                        )}
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <input 
                        type="text" 
                        placeholder="Buscar conta neste dia..." 
                        value={searchDayQuery}
                        onChange={(e) => setSearchDayQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm focus:ring-2 focus:ring-teal/20 outline-none text-teal dark:text-white transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-mint/5 border border-mint/20 rounded-xl p-4 flex items-center justify-between">
                         <div>
                            <p className="text-xs font-bold text-mint/80 uppercase tracking-wide">Receitas</p>
                            <p className="text-xl font-bold text-mint mt-1">
                                {formatCurrency(selectedDayEvents.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0))}
                            </p>
                         </div>
                         <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                             <PieChart className="w-5 h-5 text-mint" />
                         </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900/30 rounded-xl p-4 flex items-center justify-between">
                         <div>
                            <p className="text-xs font-bold text-red-500/80 uppercase tracking-wide">Despesas</p>
                            <p className="text-xl font-bold text-red-500 mt-1">
                                {formatCurrency(selectedDayEvents.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0))}
                            </p>
                         </div>
                         <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                             <PieChart className="w-5 h-5 text-red-500" />
                         </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between">
                         <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Saldo do Dia</p>
                            <p className={`text-xl font-bold mt-1 ${
                                (selectedDayEvents.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) - 
                                selectedDayEvents.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)) >= 0 
                                ? 'text-teal dark:text-white' : 'text-red-500'
                            }`}>
                                {formatCurrency(
                                    selectedDayEvents.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) - 
                                    selectedDayEvents.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
                                )}
                            </p>
                         </div>
                         <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                             <Clock className="w-5 h-5 text-gray-400" />
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-teal dark:text-white mb-4 flex items-center gap-2">
                            Movimentações <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{filteredDayTransactions.length}</span>
                        </h4>
                        
                        <div className="space-y-3">
                        {filteredDayTransactions.length > 0 ? (
                            filteredDayTransactions.map(t => {
                                const styles = getTransactionStyle(t);
                                return (
                                <div key={t.id} className={`group relative flex items-center justify-between p-4 rounded-xl border shadow-sm hover:shadow-md transition-all ${styles.bg} ${styles.border}`}>
                                    
                                    {paymentModal.open && paymentModal.transaction?.id === t.id && (
                                        <div className="absolute inset-0 bg-white dark:bg-gray-800 z-20 rounded-xl flex flex-col justify-center px-4 animate-fadeIn border-2 border-mint shadow-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-mint" />
                                                <p className="text-xs font-bold text-gray-500">Confirmar pagamento via:</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <select 
                                                        value={selectedMethod}
                                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                                        className="w-full text-sm p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-teal dark:text-white outline-none focus:border-mint"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {paymentMethods.map(pm => (
                                                            <option key={pm.id} value={pm.name}>{pm.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); handleConfirmPay(); }} className="p-2 bg-mint text-white rounded-lg hover:bg-teal transition-colors shadow-sm">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setPaymentModal({open:false, transaction:null}); }} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                                            {styles.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`font-bold text-sm truncate ${styles.text}`}>{t.description}</p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {t.category || 'Geral'} • {t.payment_method || '---'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pl-2">
                                        <p className={`font-bold ${styles.text}`}>
                                            {formatCurrency(t.amount)}
                                        </p>
                                        
                                           <div className="flex items-center gap-1">
                                        
                                        {t.type === 'expense' && t.status === 'pending' && (
                                            <button 
                                                onClick={() => handleOpenPayModal(t)}
                                                className="w-8 h-8 rounded-full bg-white hover:bg-mint hover:text-white text-gray-400 border border-gray-200 hover:border-mint transition-all flex items-center justify-center shadow-sm"
                                                title="Dar baixa (Pagar)"
                                            >
                                                <Check size={16} strokeWidth={2.5} />
                                            </button>
                                        )}
                                        {t.type === 'expense' && t.status === 'paid' && (
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm("Deseja desfazer a baixa e tornar pendente novamente?")) {
                                                        onToggleStatus(t);
                                                    }
                                                }}
                                                className="w-8 h-8 rounded-full bg-white hover:bg-orange-500 hover:text-white text-gray-400 border border-gray-200 hover:border-orange-500 transition-all flex items-center justify-center shadow-sm"
                                                title="Desfazer baixa (Tornar pendente)"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => confirmDeleteTransaction(t.id)}
                                            className="w-8 h-8 rounded-full bg-white hover:bg-red-500 hover:text-white text-gray-400 border border-gray-200 hover:border-red-500 transition-all flex items-center justify-center shadow-sm"
                                            title="Excluir movimentação"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">
                                    {searchDayQuery ? 'Nenhuma conta encontrada para esta busca' : 'Nenhuma movimentação neste dia'}
                                </p>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* COLUNA DIREITA DOS DETALHES: RESUMO CATEGORIAS + LEMBRETES */}
                    <div className="space-y-6">
                        {/* Lembretes (COM NOVOS BOTÕES) */}
                        <div>
                             <h4 className="font-bold text-teal dark:text-white mb-4 flex items-center gap-2">
                                Lembretes <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{selectedDayEvents.reminders.length}</span>
                            </h4>
                            <div className="space-y-3">
                                {selectedDayEvents.reminders.length > 0 ? (
                                    selectedDayEvents.reminders.map((r) => (
                                    <div key={r.id} className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 bg-white dark:bg-purple-900/40 rounded-lg shrink-0">
                                                <AlertCircle className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-teal dark:text-white text-sm truncate">{r.title}</p>
                                                {r.details && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.details}</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-1 ml-2">
                                          <button 
                                            onClick={() => {
                                                if(onToggleReminder) onToggleReminder(r);
                                            }}
                                            className={`p-1.5 rounded-lg transition-colors ${
                                                r.status === 'completed' 
                                                ? 'text-green-600 bg-green-100' 
                                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                            }`}
                                            title={r.status === 'completed' ? "Reabrir" : "Concluir"}
                                          >
                                            <CheckCircle size={18} />
                                          </button>
                                            <button 
                                                onClick={() => confirmDeleteReminder(r.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-xs">Sem lembretes para hoje</p>
                                    </div>
                                )}
                            </div>
                        </div>

                         {/* Resumo Categorias */}
                         <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-gray-600 dark:text-gray-300 mb-4 text-xs uppercase tracking-wider flex justify-between">
                                <span>Por Categoria</span>
                                <span>Total</span>
                            </h4>
                            <div className="space-y-3">
                                {categorySummary.length > 0 ? categorySummary.map((cat) => (
                                    <div key={cat.name} className="flex justify-between text-sm items-center">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            cat.type === 'income' 
                                                ? 'bg-mint' 
                                                : (cat.hasPending ? 'bg-red-500' : 'bg-gray-400') 
                                        }`}></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            {cat.name} <span className="text-gray-400 text-xs font-normal">({cat.count})</span>
                                        </span>
                                      </div>
                                        <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(cat.total)}</span>
                                    </div>
                                )) : <p className="text-xs text-gray-400 text-center py-2">Sem dados</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </Card>

    </div>
  );
};

export default CalendarView;