import React from 'react';
import { Bell, CalendarIcon, Plus, Trash2, Pencil } from 'lucide-react';
import Button from './UI/Button';
import { formatDate } from '../utils/formatters';

const RemindersView = ({ reminders = [], handleDelete, openModal }) => {
  return (
    <div className="animate-fadeIn pb-24 font-inter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins">Seus Lembretes</h2>
        <Button onClick={() => openModal('reminder')} variant="primary" className="text-sm px-4 py-2 w-full sm:w-auto">
          <Plus className="w-5 h-5" /> Novo Lembrete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="bg-mint/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-mint" />
            </div>
            <h3 className="text-xl font-bold text-teal dark:text-white">Você está livre de lembretes!! 🎉</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Você não possui lembretes para os próximos dias.</p>
          </div>
        ) : (
          reminders.map(rem => (
            <div key={rem.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-l-8 border-l-yellow shadow-sm flex justify-between items-start hover:shadow-md transition-shadow border border-t-gray-100 border-r-gray-100 border-b-gray-100 dark:border-gray-700 group relative overflow-hidden">
              
              <div className="flex-1 min-w-0 pr-3">
                <h3 className="font-bold text-teal dark:text-white text-lg md:text-xl mb-1 truncate">{rem.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-semibold flex items-center gap-1 mb-3">
                  <CalendarIcon className="w-3.5 h-3.5 text-mint"/> {formatDate(rem.date)}
                </p>
                {rem.details && (
                  <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm bg-bgLight dark:bg-gray-700 p-2.5 rounded-xl break-words leading-relaxed">
                    {rem.details}
                  </p>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-2 shrink-0 ml-1">
                <button 
                  onClick={() => openModal('reminder', null, rem)} 
                  className="p-2 text-gray-400 hover:text-teal transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-gray-50 dark:bg-gray-700/50"
                  title="Editar lembrete"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => handleDelete('reminders', rem.id)} 
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 bg-gray-50 dark:bg-gray-700/50"
                  title="Excluir lembrete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersView;