import React, { useState } from 'react';
import { Filter, Calendar, ChevronDown, X } from 'lucide-react';

const Filters = ({ onFilter, categories, initialFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field, value) => {
    onFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Verifica se há algum filtro ativo para mostrar indicador visual
  const hasActiveFilters = 
    initialFilters.type !== 'all' || 
    initialFilters.category !== 'all' || 
    initialFilters.status !== 'all' || 
    initialFilters.startDate !== '' || 
    initialFilters.endDate !== '';

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
          {/* Overlay para fechar ao clicar fora (opcional) */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 z-20 animate-scaleIn origin-top-right">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-teal dark:text-white font-poppins">Filtrar por</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo */}
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

              {/* Status */}
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

              {/* Categoria - AQUI ESTAVA O ERRO, AGORA CORRIGIDO */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Categoria</label>
                <select
                  value={initialFilters.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-teal dark:text-white focus:outline-none focus:ring-2 focus:ring-mint"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((cat, index) => (
                    // Correção: Usamos cat.value como key e value, e cat.label para o texto visível
                    <option key={cat.value || index} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Período</label>
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

              {/* Botão Limpar */}
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
                  className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Filters;