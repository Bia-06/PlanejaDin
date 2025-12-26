import React from 'react';
import { Bell, CalendarIcon, Plus } from 'lucide-react';
import Card from './UI/Card';
import Button from './UI/Button';
import { formatDate } from '../utils/formatters';

const RemindersView = ({ reminders = [], handleDelete, openModal }) => {
  return (
    <div className="animate-fadeIn pb-24 font-inter">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins">Seus Lembretes</h2>
        <Button onClick={() => openModal('reminder')} variant="primary" className="text-sm px-4 py-2">
          <Plus className="w-5 h-5" /> Novo Lembrete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <Bell className="w-16 h-16 mx-auto mb-4 text-mint opacity-20" />
            <h3 className="text-xl font-bold text-teal dark:text-white">Você está livre de lembretes!! 🎉</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Você não possui lembretes para os próximos dias.</p>
          </div>
        ) : (
          reminders.map(rem => (
            <div key={rem.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-l-8 border-l-yellow shadow-sm flex justify-between items-start hover:shadow-md transition-shadow border border-t-gray-100 border-r-gray-100 border-b-gray-100 dark:border-gray-700">
              <div>
                <h3 className="font-bold text-teal dark:text-white text-xl mb-1">{rem.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold flex items-center gap-1 mb-3">
                  <CalendarIcon className="w-4 h-4 text-mint"/> {formatDate(rem.date)}
                </p>
                {rem.details && <p className="text-gray-700 dark:text-gray-300 text-sm bg-bgLight dark:bg-gray-700 p-3 rounded-xl">{rem.details}</p>}
              </div>
              <button onClick={() => handleDelete('reminders', rem.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersView;