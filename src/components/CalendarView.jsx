import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, CalendarIcon, CheckCircle, 
  Clock, AlertCircle, Star 
} from 'lucide-react';
import Card from './UI/Card';
import { formatDate, formatCurrency } from '../utils/formatters';

const CalendarView = ({ transactions = [], reminders = [] }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  // Lista de Feriados Fixos (Dia-Mês)
  const fixedHolidays = {
    '1-1': 'Ano Novo',
    '21-4': 'Tiradentes',
    '1-5': 'Dia do Trabalho',
    '7-9': 'Independência',
    '12-10': 'N. Sra. Aparecida',
    '2-11': 'Finados',
    '15-11': 'Proclamação da República',
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
    const hasExpense = transactions.some(t => t.type === 'expense');
    const hasPending = transactions.some(t => t.status === 'pending');
    const hasReminder = reminders.length > 0;
    
    return { hasIncome, hasExpense, hasPending, hasReminder };
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

  return (
    <div className="animate-fadeIn pb-24 font-inter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins">Calendário Financeiro</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visualize suas movimentações por data</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
                const now = new Date();
                setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                setSelectedDay(now.getDate());
            }}
            className="px-4 py-2 bg-mint hover:bg-[#00b57a] text-white rounded-xl font-medium transition-colors text-sm shadow-sm"
          >
            Hoje
          </button>
          
          <div className="flex items-center bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-teal dark:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="px-4 font-bold text-teal dark:text-white capitalize min-w-[180px] text-center">
              {monthName}
            </span>
            
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-teal dark:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="grid grid-cols-7 text-center mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-gray-400 font-bold text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {/* Dias vazios do início */}
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[100px] bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border border-transparent" />
              ))}
              
              {/* Dias do mês */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isToday = 
                  day === today.getDate() && 
                  month === today.getMonth() && 
                  year === today.getFullYear();
                
                const isSelected = day === selectedDay;
                const events = getDayEventsSummary(day);
                const holidayName = checkHoliday(day, month);
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[100px] rounded-lg flex flex-col items-start justify-start p-2 transition-all border
                      ${isToday ? 'border-mint ring-1 ring-mint bg-mint/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
                      ${isSelected ? 'ring-2 ring-teal border-teal z-10 shadow-md' : 'hover:border-teal/50 hover:shadow-sm'}
                    `}
                  >
                    <div className="flex justify-between items-start w-full mb-1">
                      <span className={`text-sm font-bold ${isToday ? 'text-mint' : 'text-gray-700 dark:text-gray-300'}`}>
                        {day}
                      </span>
                      
                      {/* Ícone de Feriado (Estrela) - Ajustado para amarelo brilhante no dark mode */}
                      {holidayName && (
                        <div className="group relative">
                          <Star className="w-3.5 h-3.5 text-yellow fill-yellow" />
                        </div>
                      )}
                    </div>

                    {/* Indicadores de eventos (Bolinhas) */}
                    <div className="flex gap-1 mb-2">
                      {events.hasIncome && <div className="w-1.5 h-1.5 rounded-full bg-mint" title="Receita"></div>}
                      {events.hasExpense && <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="Despesa"></div>}
                      {events.hasPending && <div className="w-1.5 h-1.5 rounded-full bg-yellow" title="Pendente"></div>}
                      {events.hasReminder && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Lembrete"></div>}
                    </div>
                    
                    {/* Lista rápida de eventos (Texto) */}
                    <div className="w-full space-y-1 overflow-hidden">
                      {holidayName && (
                          // Ajustado amarelo brilhante no texto do feriado
                          <div className="text-[10px] px-1 py-0.5 rounded truncate w-full text-left bg-yellow/10 text-yellow-600 border border-yellow/20 font-bold dark:text-yellow-300 dark:border-yellow-300/30 dark:bg-yellow-400/10">
                            {holidayName}
                          </div>
                      )}
                      
                      {getItemsForDay(day).transactions.slice(0, holidayName ? 1 : 2).map((t) => (
                        <div 
                          key={t.id} 
                          className={`text-[10px] px-1 py-0.5 rounded truncate w-full text-left border ${
                            t.type === 'income' 
                              ? 'bg-mint/10 text-mint border-mint/20' 
                              : t.status === 'pending'
                                ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800'
                                : 'bg-red-50 text-red-500 border-red-100 dark:bg-red-900/20 dark:border-red-800'
                          }`}
                        >
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

        {/* Painel lateral com detalhes do dia */}
        <div>
          <Card className="p-6 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-mint/10 rounded-xl">
                <CalendarIcon className="w-6 h-6 text-mint" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-teal dark:text-white">Detalhes do Dia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDayEvents.date}</p>
                {checkHoliday(selectedDay, month) && (
                   <p className="text-xs font-bold flex items-center gap-1 mt-1 text-yellow-600 dark:text-yellow-300">
                     <Star size={10} className="fill-yellow-500 text-yellow-500 dark:text-yellow-300 dark:fill-yellow-300" /> 
                     {checkHoliday(selectedDay, month)}
                   </p>
                )}
              </div>
            </div>
            
            {/* Resumo do dia */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Saldo do dia:</span>
                <span className="font-bold text-teal dark:text-white">
                  {formatCurrency(
                    selectedDayEvents.transactions
                      .filter(t => t.type === 'income')
                      .reduce((sum, t) => sum + t.amount, 0) -
                    selectedDayEvents.transactions
                      .filter(t => t.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500">Receitas</p>
                  <p className="text-sm font-bold text-mint">
                    {formatCurrency(
                      selectedDayEvents.transactions
                        .filter(t => t.type === 'income')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500">Despesas</p>
                  <p className="text-sm font-bold text-red-500">
                    {formatCurrency(
                      selectedDayEvents.transactions
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Lista de transações do dia */}
            <div className="mb-6">
              <h4 className="font-bold text-teal dark:text-white mb-3 flex items-center gap-2 text-sm">
                <span>Transações</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  {selectedDayEvents.transactions.length}
                </span>
              </h4>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {selectedDayEvents.transactions.length > 0 ? (
                  selectedDayEvents.transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${t.type === 'income' ? 'bg-mint/10' : 'bg-red-50 dark:bg-red-900/20'}`}>
                          {t.type === 'income' ? (
                            <span className="text-mint font-bold text-xs">+</span>
                          ) : (
                            <span className="text-red-500 font-bold text-xs">-</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-teal dark:text-white text-xs">{t.description}</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1">
                            {t.status === 'paid' ? (
                              <span className="flex items-center gap-0.5 text-mint"><CheckCircle size={10} /> Pago</span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-yellow-600"><Clock size={10} /> Pendente</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold text-xs ${t.type === 'income' ? 'text-mint' : 'text-red-500'}`}>
                        {formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                    <CalendarIcon className="w-6 h-6 mx-auto mb-1 opacity-20" />
                    <p className="text-xs">Nada registrado</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Lista de lembretes do dia */}
            <div>
              <h4 className="font-bold text-teal dark:text-white mb-3 flex items-center gap-2 text-sm">
                <span>Lembretes</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  {selectedDayEvents.reminders.length}
                </span>
              </h4>
              
              <div className="space-y-2">
                {selectedDayEvents.reminders.length > 0 ? (
                  selectedDayEvents.reminders.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800">
                      <AlertCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-teal dark:text-white text-xs">{r.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-xs">Sem lembretes</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Legenda Aumentada e Centralizada */}
      <div className="mt-8">
        <Card className="p-6">
          <h4 className="font-bold text-lg text-teal dark:text-white mb-5 text-center">Legenda do Calendário</h4>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow fill-yellow"/>
              <p className="font-bold text-sm text-gray-700 dark:text-gray-200">Feriado</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-mint"></div>
              <p className="font-bold text-sm text-gray-700 dark:text-gray-200">Receita</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <p className="font-bold text-sm text-gray-700 dark:text-gray-200">Despesa</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow"></div>
              <p className="font-bold text-sm text-gray-700 dark:text-gray-200">Pendente</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <p className="font-bold text-sm text-gray-700 dark:text-gray-200">Lembrete</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;