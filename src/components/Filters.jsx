import React, { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

const Filters = ({ onFilter, categories, initialFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field, value) => {
    onFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funções auxiliares para calcular strings de data
  const getDateString = (offset = 0) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      return d.toISOString().split('T')[0];
  };

  const getMonthDates = () => {
      const today = new Date();
      const first = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      return { start: first, end: last };
  };

  const setQuickDate = (type) => {
    let start = '';
    let end = '';

    if (type === 'today') {
        const str = getDateString(0);
        start = str; end = str;
    } else if (type === 'yesterday') {
        const str = getDateString(-1);
        start = str; end = str;
    } else if (type === 'tomorrow') {
        const str = getDateString(1);
        start = str; end = str;
    } else if (type === 'month') {
        const dates = getMonthDates();
        start = dates.start; end = dates.end;
    } else if (type === 'all') {
        start = ''; end = '';
    }

    onFilter(prev => ({
        ...prev,
        startDate: start,
        endDate: end
    }));
  };

  // Verificações para estilo ativo
  const isTodayActive = initialFilters.startDate === getDateString(0) && initialFilters.endDate === getDateString(0);
  const isYesterdayActive = initialFilters.startDate === getDateString(-1) && initialFilters.endDate === getDateString(-1);
  const isTomorrowActive = initialFilters.startDate === getDateString(1) && initialFilters.endDate === getDateString(1);
  const monthDates = getMonthDates();
  const isMonthActive = initialFilters.startDate === monthDates.start && initialFilters.endDate === monthDates.end;

  const hasActiveFilters = 
    initialFilters.type !== 'all' || 
    initialFilters.category !== 'all' || 
    initialFilters.status !== 'all' || 
    initialFilters.startDate !== '' || 
    initialFilters.endDate !== '';

  const activeButtonStyle = "bg-mint text-white border-transparent shadow-md font-bold";
  const inactiveButtonStyle = "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          isOpen || hasActiveFilters
            ? 'bg-mint/10 border-mint text-mint font-medium' 
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filtros</span>
        {hasActiveFilters && (
          <span className="flex h-2 w-2 rounded-full bg-mint"></span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div 
            className="
              fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none
              md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 md:block md:p-0
            "
          >
            <div 
              className="
                w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-5 animate-scaleIn pointer-events-auto
                md:w-80
              "
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-teal dark:text-white font-poppins flex items-center gap-2">
                  <Filter className="w-4 h-4 text-mint" /> Filtrar Transações
                </h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* --- FILTROS RÁPIDOS DE DATA (COM DESTAQUE) --- */}
                <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Filtro Rápido</label>
                      <div className="grid grid-cols-2 gap-2">
                         <button 
                            onClick={() => setQuickDate('yesterday')} 
                            className={`text-xs py-1.5 px-2 rounded border transition-colors ${isYesterdayActive ? activeButtonStyle : inactiveButtonStyle}`}
                         >
                            Ontem
                         </button>
                         <button 
                            onClick={() => setQuickDate('today')} 
                            className={`text-xs py-1.5 px-2 rounded border transition-colors ${isTodayActive ? activeButtonStyle : inactiveButtonStyle}`}
                         >
                            Hoje
                         </button>
                         <button 
                            onClick={() => setQuickDate('tomorrow')} 
                            className={`text-xs py-1.5 px-2 rounded border transition-colors ${isTomorrowActive ? activeButtonStyle : inactiveButtonStyle}`}
                         >
                            Amanhã
                         </button>
                         <button 
                            onClick={() => setQuickDate('month')} 
                            className={`text-xs py-1.5 px-2 rounded border transition-colors ${isMonthActive ? activeButtonStyle : inactiveButtonStyle}`}
                         >
                            Este Mês
                         </button>
                      </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Tipo</label>
                  <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    {[
                      { val: 'all', label: 'Todos' },
                      { val: 'income', label: 'Receitas' },
                      { val: 'expense', label: 'Despesas' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => handleChange('type', opt.val)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                          initialFilters.type === opt.val
                            ? 'bg-white dark:bg-gray-600 text-teal dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Status</label>
                  <select
                    value={initialFilters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-teal dark:text-white focus:outline-none focus:ring-2 focus:ring-mint"
                  >
                    <option value="all">Todos</option>
                    <option value="paid">Pago / Recebido</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Categoria</label>
                  <select
                    value={initialFilters.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-teal dark:text-white focus:outline-none focus:ring-2 focus:ring-mint"
                  >
                    <option value="all">Todas as categorias</option>
                    {categories.map((cat, index) => (
                      <option key={cat.value || index} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Período (Manual)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="date"
                        value={initialFilters.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full px-2 py-2 pl-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs text-teal dark:text-white focus:outline-none focus:ring-2 focus:ring-mint"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={initialFilters.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full px-2 py-2 pl-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs text-teal dark:text-white focus:outline-none focus:ring-2 focus:ring-mint"
                      />
                    </div>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => onFilter({
                      type: 'all',
                      category: 'all',
                      status: 'all',
                      startDate: '',
                      endDate: '',
                      minAmount: '',
                      maxAmount: ''
                    })}
                    className="w-full py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-red-100 dark:border-red-900/30 mt-2"
                  >
                    Limpar Todos os Filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Filters;