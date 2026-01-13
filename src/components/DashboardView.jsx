import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calendar, PieChart, Sun, Moon, Bell } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const DashboardView = ({ 
  user, 
  summary, 
  chartData, 
  reminders,
  isDarkMode,
  setIsDarkMode,
  openModal,
  setView
}) => {
  
  const getDisplayName = () => {
      const fullName = user?.user_metadata?.name || 'Desenvolvedor';
      const parts = fullName.trim().split(/\s+/); 
      
      if (parts.length > 1) {
          return `${parts[0]} ${parts[parts.length - 1]}`;
      }
      return fullName; 
  };

  return (
    <div className="animate-fadeIn font-inter pb-32 md:pb-0 md:max-h-[calc(100vh-120px)]">

      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-teal dark:text-white font-poppins">
            Olá, {getDisplayName()}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Aqui está o seu resumo.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView('calendar')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-teal dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar className="w-4 h-4 text-teal dark:text-white" />
            <span className="hidden sm:inline">Ver Agenda</span>
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-teal dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-teal" />
                <span className="hidden sm:inline">Modo Escuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-mint to-teal rounded-xl p-6 text-white shadow-lg h-full">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <p className="text-sm opacity-90">Saldo Total</p>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">{formatCurrency(summary.balance)}</h2>
              </div>
              <div className="mt-auto flex justify-between items-end">
                <div className="text-sm opacity-90">
                  {summary.balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  {summary.balance >= 0 ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-teal dark:text-white text-sm">Receitas</h3>
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-1 font-bold text-green-600 dark:text-green-400 mb-4">
              {formatCurrency(summary.income)}
            </p>
            <button 
              onClick={() => openModal('transaction', 'income')}
              className="mt-auto py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              + Adicionar Receita
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-teal dark:text-white text-sm">Despesas</h3>
              <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-1 font-bold text-red-600 dark:text-red-400 mb-4">
              {formatCurrency(summary.expense)}
            </p>
            <button 
              onClick={() => openModal('transaction', 'expense')}
              className="mt-auto py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              + Adicionar Despesa
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-teal dark:text-white">Distribuição de Gastos</h3>
              <div className="p-1.5 bg-mint/10 rounded-lg">
                <PieChart className="w-4 h-4 text-mint" />
              </div>
            </div>
            <div className="space-y-3">
              {chartData.length > 0 ? (
                chartData.slice(0, 3).map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-teal dark:text-gray-300 truncate">{item.name}</span>
                      <span className="text-sm font-bold text-teal dark:text-white">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-mint h-2 rounded-full" style={{ width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <PieChart className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sem dados de gastos ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          {summary.pendingBills > 0 ? (
            <div className="h-full bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-700/50 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-200/50 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-amber-100 dark:bg-amber-800/40 rounded-xl shrink-0 border border-amber-200 dark:border-amber-700/50">
                  <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg leading-tight">
                    Atenção! Você tem <span className="font-bold text-amber-900 dark:text-amber-100">{formatCurrency(summary.pendingBills)}</span> em contas a pagar.
                  </h3>
                  <p className="text-amber-800/80 dark:text-amber-200/70 text-sm mt-1">Que vencem hoje ou estão atrasadas. Evite juros!</p>
                  <button onClick={() => setView('transactions')} className="mt-3 text-sm font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-white flex items-center gap-1 transition-colors">Ver Contas Pendentes →</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-gradient-to-r from-mint to-teal rounded-xl p-5 text-white shadow-lg flex items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold text-lg">Tudo em dia! 🎉</h3>
                  <p className="text-white/90 text-sm mt-1">Você não tem contas pendentes. Continue assim!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 h-[200px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-teal dark:text-white">Lembretes Rápidos</h3>
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              {reminders.length > 0 ? (
                <div className="space-y-3">
                  {reminders.slice(0, 1).map(reminder => (
                    <div key={reminder.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 truncate">
                          <p className="font-medium text-teal dark:text-white text-sm truncate">{reminder.title}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-bold">
                            {new Date(reminder.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setView('reminders')} className="w-full mt-2 py-2 bg-gray-50 dark:bg-gray-700/50 text-teal dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Veja seus lembretes →</button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bell className="w-5 h-5 text-blue-400 opacity-50" />
                  </div>
                  <p className="text-xs font-bold text-teal dark:text-white">Você está livre de lembretes!! 🎉</p>
                  <button onClick={() => openModal('reminder')} className="mt-3 text-[10px] text-blue-500 hover:underline uppercase font-bold tracking-wider">Agendar algo agora</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-bold text-lg text-teal dark:text-white mb-3 font-poppins">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button onClick={() => openModal('transaction', 'income')} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:border-green-400 hover:shadow-md transition-all group">
            <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl mb-3 group-hover:scale-110 transition-transform"><TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
            <span className="font-medium text-teal dark:text-white">Nova Receita</span>
          </button>
          <button onClick={() => openModal('transaction', 'expense')} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:border-red-400 hover:shadow-md transition-all group">
            <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl mb-3 group-hover:scale-110 transition-transform"><TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
            <span className="font-medium text-teal dark:text-white">Nova Despesa</span>
          </button>
          <button onClick={() => openModal('reminder')} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:border-purple-400 hover:shadow-md transition-all group">
            <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl mb-3 group-hover:scale-110 transition-transform"><Calendar className="w-6 h-6 text-yellow-600 dark:text-white" /></div>
            <span className="font-medium text-teal dark:text-white">Novo Lembrete</span>
          </button>
          <button onClick={() => setView('reports')} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:border-blue-400 hover:shadow-md transition-all group">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-3 group-hover:scale-110 transition-transform"><PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
            <span className="font-medium text-teal dark:text-white">Ver Relatório</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;