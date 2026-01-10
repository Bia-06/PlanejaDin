import React, { useState } from 'react';
import { 
  Bell, CalendarIcon, Plus, Trash2, Pencil, CheckCircle, 
  Clock, RotateCcw, ChevronDown, ChevronUp, Filter, CalendarDays 
} from 'lucide-react';
import Button from './UI/Button';
import { formatDate, getLocalDateString } from '../utils/formatters';

const RemindersView = ({ reminders = [], handleDelete, openModal, updateReminder }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'tomorrow', 'month'

  // Datas de referência
  const todayStr = getLocalDateString();
  
  // Calcular data de amanhã
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  // Separação inicial: Concluídos vs Ativos
  const completedReminders = reminders.filter(r => r.completed);
  const activeReminders = reminders.filter(r => !r.completed);

  // Separação dos Ativos: Hoje/Atrasados vs Futuros
  const todayOrOverdueReminders = activeReminders.filter(r => r.date <= todayStr);
  const futureReminders = activeReminders.filter(r => r.date > todayStr);

  // Aplicação dos Filtros nos Futuros
  const filteredFutureReminders = futureReminders.filter(r => {
    if (filterType === 'tomorrow') {
      return r.date === tomorrowStr;
    }
    if (filterType === 'month') {
      // Verifica se o mês e ano são iguais ao atual (YYYY-MM)
      return r.date.startsWith(todayStr.substring(0, 7));
    }
    return true; // 'all' mostra todos os futuros
  });

  // Função para marcar como concluído/pendente
  const toggleReminderStatus = async (reminder) => {
    if (updateReminder) {
        await updateReminder(reminder.id, { completed: !reminder.completed });
    }
  };

  const ReminderCard = ({ rem, isCompleted }) => {
      const isOverdue = !isCompleted && rem.date < todayStr;
      const isToday = !isCompleted && rem.date === todayStr;
      
      // MANTIDO: Borda Roxa (purple-500) para futuros e dia vigente
      let borderClass = 'border-l-purple-500 dark:border-l-purple-500'; 
      
      if (isCompleted) {
          borderClass = 'border-l-gray-300 dark:border-l-gray-600'; 
      } else if (isOverdue) {
          borderClass = 'border-l-red-500 dark:border-l-red-500'; 
      } 

      return (
        <div className={`
            bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex justify-between items-start 
            hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 relative overflow-hidden group
            ${isCompleted ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : `border-l-8 ${borderClass}`}
        `}>
          
          <div className="flex-1 min-w-0 pr-3">
            {/* ALTERADO: Título voltou para Cinza (gray-700) e Branco no dark mode */}
            <h3 className={`font-bold text-lg md:text-xl mb-1 truncate transition-all ${isCompleted ? 'text-gray-500 dark:text-gray-500 line-through decoration-2' : 'text-gray-700 dark:text-white'}`}>
                {rem.title}
            </h3>
            
            <p className={`text-xs md:text-sm font-semibold flex items-center gap-1 mb-3 ${isOverdue ? 'text-red-500 dark:text-red-400 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
              {/* ALTERADO: Ícone do calendário agora é Cinza (gray-400) se não estiver atrasado */}
              <CalendarIcon className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}/> 
              {formatDate(rem.date)}
              
              {isOverdue && (
                  <span className="text-[10px] uppercase bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded ml-2 font-bold tracking-wide">
                    Atrasado
                  </span>
              )}
              {/* Badge "Hoje" mantida em roxo para combinar com a borda */}
              {!isCompleted && isToday && (
                  <span className="text-[10px] uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded ml-2 font-bold tracking-wide">
                    Hoje
                  </span>
              )}
            </p>

            {rem.details && (
              <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm bg-bgLight dark:bg-gray-700/50 p-2.5 rounded-xl break-words leading-relaxed">
                {rem.details}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0 ml-1">
            <button 
              onClick={() => toggleReminderStatus(rem)} 
              className={`p-2 transition-colors rounded-lg ${
                isCompleted 
                    ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                    : 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              title={isCompleted ? "Reativar lembrete" : "Concluir lembrete"}
            >
              {isCompleted ? <RotateCcw className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            </button>

            {!isCompleted && (
                <button 
                    onClick={() => openModal('reminder', null, rem)} 
                    className="p-2 text-gray-400 hover:text-purple-500 dark:text-gray-500 dark:hover:text-purple-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Editar lembrete"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            )}

            <button 
              onClick={() => handleDelete('reminders', rem.id)} 
              className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Excluir definitivamente"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
  };

  const FilterButton = ({ label, value, active }) => (
    <button
      onClick={() => setFilterType(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
        active 
          ? 'bg-teal text-white border-teal shadow-md shadow-teal/20' // ALTERADO: Verde/Teal (igual Novo Lembrete)
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' // ALTERADO: Hover mais claro no dark mode (gray-600)
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="animate-fadeIn pb-24 font-inter space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins flex items-center gap-2">
           Lembretes
        </h2>
        <Button onClick={() => openModal('reminder')} variant="primary" className="text-sm px-4 py-2 w-full sm:w-auto">
          <Plus className="w-5 h-5" /> Novo Lembrete
        </Button>
      </div>

      {/* --- SEÇÃO 1: FOCO (HOJE & ATRASADOS) --- */}
      {todayOrOverdueReminders.length > 0 && (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Foco de Hoje
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayOrOverdueReminders.map(rem => (
                    <ReminderCard key={rem.id} rem={rem} isCompleted={false} />
                ))}
            </div>
        </div>
      )}

      {/* --- SEÇÃO 2: PRÓXIMOS (COM FILTROS) --- */}
      <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-2">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <CalendarDays className="lucide lucide-calendar-days w-4 h-4 text-amber-500" />
                Próximos
            </h3>
            
            {/* Barra de Filtros */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-gray-400 mr-1 hidden sm:block" />
                <FilterButton label="Todos" value="all" active={filterType === 'all'} />
                <FilterButton label="Amanhã" value="tomorrow" active={filterType === 'tomorrow'} />
                <FilterButton label="Este Mês" value="month" active={filterType === 'month'} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFutureReminders.length === 0 ? (
              <div className="col-span-1 md:col-span-2 py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {filterType === 'all' 
                        ? 'Nenhum lembrete futuro agendado.' 
                        : 'Nenhum lembrete encontrado para este filtro.'}
                </p>
              </div>
            ) : (
                filteredFutureReminders.map(rem => (
                <ReminderCard key={rem.id} rem={rem} isCompleted={false} />
              ))
            )}
          </div>
      </div>

      {/* Feedback Visual Vazio Global */}
      {todayOrOverdueReminders.length === 0 && futureReminders.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 mt-4">
            <div className="bg-mint/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-mint" />
            </div>
            <h3 className="text-lg font-bold text-teal dark:text-white">Tudo em dia!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Você não tem lembretes pendentes.</p>
          </div>
      )}

      {/* --- SEÇÃO 3: HISTÓRICO --- */}
      {completedReminders.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold hover:text-teal dark:hover:text-mint transition-colors mb-4 text-sm uppercase tracking-wide"
                >
                   <Clock className="w-4 h-4 text-amber-500" /> 
                   Histórico de Concluídos ({completedReminders.length})
                   {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showHistory && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                        {completedReminders.map(rem => (
                            <ReminderCard key={rem.id} rem={rem} isCompleted={true} />
                        ))}
                    </div>
                )}
          </div>
      )}

    </div>
  );
};

export default RemindersView;