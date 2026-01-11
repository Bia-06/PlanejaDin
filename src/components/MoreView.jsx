import React, { useState, useEffect } from 'react';
import { Settings, FileText, ChevronRight, Info, ArrowLeft, LogOut } from 'lucide-react';
import Card from './UI/Card';
import SettingsView from './SettingsView';
import ReportsView from './ReportsView';

const MoreView = ({ 
  user, 
  transactions, 
  isDarkMode, 
  setIsDarkMode,
  onLogout,
  resetKey 
}) => {
  
  const [subView, setSubView] = useState('menu'); 

  useEffect(() => {
    if (resetKey > 0) {
      setSubView('menu');
    }
  }, [resetKey]);

  if (subView === 'menu') {
    return (
      <div className="animate-fadeIn pb-24 font-inter">
        <h2 className="text-2xl font-bold mb-6 text-teal dark:text-white font-poppins">Mais Opções</h2>
        
        <div className="space-y-4">
          
          <button 
            onClick={() => setSubView('settings')}
            className="w-full bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-teal transition-all"
          >
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-teal/10 dark:bg-gray-700 flex items-center justify-center text-teal dark:text-gray-300 group-hover:bg-teal group-hover:text-white transition-colors">
                  <Settings size={24} />
               </div>
               <div className="text-left">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg">Minha Conta</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Perfil, senha e preferências</p>
               </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-teal" />
          </button>

          <button 
            onClick={() => setSubView('reports')}
            className="w-full bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-teal transition-all"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-teal/10 dark:bg-gray-700 flex items-center justify-center text-teal dark:text-gray-300 group-hover:bg-teal group-hover:text-white transition-colors">
                  <FileText size={24} />
               </div>
               <div className="text-left">
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg">Relatórios Financeiros</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gráficos e evolução de gastos</p>
               </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-teal" />
          </button>

          <Card className="mt-8 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 mb-2">
              <Info className="w-5 h-5 text-mint" />
              <h3 className="font-bold text-teal dark:text-white">Sobre o App</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
               <p className="flex justify-between"><span>Versão Atual:</span><span className="font-mono font-bold text-teal dark:text-white">v1.0.30 (Beta)</span></p>
               <p className="flex justify-between"><span>Última Atualização:</span><span>11 JAN 2026</span></p>
              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-400">
                Feito com 💜 por <a href="https://portfolio--beatriz.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-mint font-bold hover:underline transition-all">Beatriz Pires</a>
              </div>
            </div>
          </Card>

          <button 
            onClick={onLogout}
            className="w-full p-4 mt-4 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
          >
            <LogOut size={20} /> Sair do App
          </button>

        </div>
      </div>
    );
  }

  if (subView === 'settings') {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => setSubView('menu')} className="flex items-center gap-2 text-gray-500 mb-4 hover:text-teal transition-colors">
          <ArrowLeft size={20} /> Voltar para Mais
        </button>
        <SettingsView 
          user={user} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          onLogout={onLogout} 
        />
      </div>
    );
  }

  if (subView === 'reports') {
    return (
      <div className="animate-in slide-in-from-right duration-300 pb-24">
        <button onClick={() => setSubView('menu')} className="flex items-center gap-2 text-gray-500 mb-4 hover:text-teal transition-colors">
          <ArrowLeft size={20} /> Voltar para Mais
        </button>
        <ReportsView transactions={transactions} />
      </div>
    );
  }
};

export default MoreView;