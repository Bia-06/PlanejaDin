import React, { useState } from 'react';
import { 
  ArrowUp, ArrowDown, Search, Plus, 
  Clock, AlertCircle, CheckCircle, Trash2, X, Pencil, CreditCard 
} from 'lucide-react';
import Button from './UI/Button';
import Filters from './Filters';
import { formatCurrency, formatDate, getLocalDateString } from '../utils/formatters';

const TransactionsView = ({ 
  transactions, 
  filters, 
  setFilters, 
  searchTerm, 
  setSearchTerm, 
  categoryOptions, 
  categories = [], 
  paymentMethods = [], 
  openModal, 
  handleToggleStatus, 
  handleDelete,
  handleBatchDelete 
}) => {
  const today = getLocalDateString();
  
  const [selectedIds, setSelectedIds] = useState([]);

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      if (filters.type !== 'all' && transaction.type !== filters.type) return false;
      if (filters.category !== 'all' && transaction.category !== filters.category) return false;
      if (filters.status !== 'all' && transaction.status !== filters.status) return false;
      
      if (filters.startDate && transaction.date < filters.startDate) return false;
      if (filters.endDate && transaction.date > filters.endDate) return false;

      if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const hasActiveFilters = Object.keys(filters).some(key => filters[key] && filters[key] !== 'all' && filters[key] !== '');

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
        setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0) {
        setSelectedIds([]); 
    } else {
        setSelectedIds(filteredTransactions.map(t => t.id)); 
    }
  };

  const onBatchDeleteClick = async () => {
     if(selectedIds.length === 0) return;
     await handleBatchDelete(selectedIds);
     setSelectedIds([]); 
  };

  return (
    <div className="animate-fadeIn pb-24 font-inter">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins flex items-center gap-3">
          Suas Movimentações
          {selectedIds.length > 0 && (
             <span className="text-xs bg-mint text-white px-2 py-1 rounded-lg">
                {selectedIds.length} selecionado(s)
             </span>
          )}
        </h2>
        
        {selectedIds.length > 0 ? (
           <div className="flex items-center gap-2 animate-fadeIn">
              <Button 
                onClick={onBatchDeleteClick} 
                className="bg-red-600 text-white hover:bg-red-700 shadow-md border-transparent px-4 py-2 text-sm flex items-center gap-2 font-bold"
              >
                 <Trash2 className="w-4 h-4" /> Apagar Selecionados
              </Button>
              <button 
                onClick={() => setSelectedIds([])} 
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="w-5 h-5" />
              </button>
           </div>
        ) : (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Buscar transações..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full md:w-64 pl-10 pr-10 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-teal dark:text-white focus:ring-2 focus:ring-mint outline-none" 
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Filters onFilter={setFilters} categories={categoryOptions} initialFilters={filters} />
              <Button onClick={() => openModal('transaction', 'expense', null)} variant="primary" className="text-sm px-4 py-2">
                <Plus className="w-5 h-5" /> Nova
              </Button>
            </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => { setFilters({ type: 'all', category: 'all', status: 'all', startDate: '', endDate: '', minAmount: '', maxAmount: '' }); setSearchTerm(''); }} className="text-sm text-mint hover:underline font-medium">
            Limpar todos os filtros
          </button>
        </div>
      )}

      {filteredTransactions.length > 0 && (
          <div className="mb-4 flex items-center gap-3 px-2">
             <input 
                type="checkbox" 
                checked={selectedIds.length > 0 && selectedIds.length === filteredTransactions.length}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-gray-300 text-mint focus:ring-mint cursor-pointer accent-mint"
             />
             <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedIds.length === filteredTransactions.length ? "Desmarcar todos" : "Selecionar todos"}
             </span>
          </div>
      )}

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="font-medium">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          filteredTransactions.map(item => {
            const isOverdue = item.status === 'pending' && item.date < today;
            const isSelected = selectedIds.includes(item.id);

            const catObj = categories.find(c => c.name === item.category);
            const catColor = catObj ? catObj.color : '#2DD4BF';

            const pmObj = paymentMethods.find(pm => pm.name === item.payment_method);
            const pmColor = pmObj ? pmObj.color : '#2DD4BF';

            return (
              <div 
                key={item.id} 
                className={`
                    bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border transition-all hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0
                    ${isSelected ? 'border-mint ring-1 ring-mint bg-mint/5 dark:bg-mint/5' : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                `}
              >
                
                <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                  <div className="flex items-center justify-center">
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-mint focus:ring-mint cursor-pointer accent-mint"
                    />
                  </div>

                  <div className={`p-4 rounded-2xl flex items-center justify-center shrink-0 ${item.type === 'income' ? 'bg-mint/10 text-mint' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                    {item.type === 'income' ? <ArrowUp className="w-6 h-6" /> : <ArrowDown className="w-6 h-6" />}
                  </div>
                  <div className="min-w-0"> 
                    <p className="font-bold text-teal dark:text-white text-lg truncate pr-2">{item.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-0.5 flex flex-wrap items-center gap-2">
                      <span className={isOverdue ? "text-red-500 font-bold" : ""}>{formatDate(item.date)}</span>
                      <span 
                        className="px-2 py-0.5 rounded text-xs flex items-center gap-1 border"
                        style={{ 
                            backgroundColor: `${catColor}15`, 
                            color: catColor,
                            borderColor: `${catColor}30`
                        }}
                      >
                        {item.category}
                        {item.subcategory && (
                           <>
                             <span className="opacity-50">›</span>
                             <span>{item.subcategory}</span>
                           </>
                        )}
                      </span>
                      
                      {item.status === 'pending' && !isOverdue && (
                        <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800">
                          <Clock className="w-3 h-3" /> Pendente
                        </span>
                      )}
                      
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800">
                          <AlertCircle className="w-3 h-3" /> Em atraso
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto pt-3 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-t-0">
                  <span className={`font-bold text-lg font-inter ${item.type === 'income' ? 'text-mint' : 'text-teal dark:text-white'}`}>
                    {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                  </span>
                  
                  <div className="flex items-center gap-2 mt-0 md:mt-2">
                    <button 
                      onClick={() => handleToggleStatus(item)} 
                      style={item.status === 'paid' ? {
                          backgroundColor: `${pmColor}15`, 
                          color: pmColor,
                          borderColor: `${pmColor}30`
                      } : {}}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-colors border ${
                        item.status === 'paid' 
                          ? '' 
                          : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800'
                      }`}
                    >
                      {item.status === 'paid' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Pago - {item.payment_method}
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" /> Pendente
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => openModal('transaction', item.type, item)} 
                      className="p-2 text-gray-400 hover:text-teal transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    <button onClick={() => handleDelete('transactions', item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionsView;