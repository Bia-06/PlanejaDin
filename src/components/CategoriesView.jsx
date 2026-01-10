import React, { useState, useMemo } from 'react';
import { 
    Tag, Plus, X, Trash2, CreditCard, ChevronDown, ChevronRight, 
    Layers, Pencil, Check 
} from 'lucide-react'; 
import Card from './UI/Card';

const CategoriesView = ({ 
  categories = [], 
  addCategory, 
  updateCategory, 
  deleteCategory,
  paymentMethods = [],
  addPaymentMethod,
  updatePaymentMethod, 
  deletePaymentMethod,
  transactions = [] 
}) => {

  const [newCategory, setNewCategory] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#2DD4BF');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [newSubcat, setNewSubcat] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [newPaymentColor, setNewPaymentColor] = useState('#F472B6');

  // ... (Mantenha os useMemo de estatísticas iguais) ...
  const categoryStats = useMemo(() => {
    const stats = {};
    transactions.forEach(t => {
        if (!stats[t.category]) stats[t.category] = 0;
        stats[t.category] += Number(t.amount);
    });
    return stats;
  }, [transactions]);

  const subcategoryStats = useMemo(() => {
    const stats = {};
    transactions.forEach(t => {
        if (t.subcategory) {
            const key = `${t.category}-${t.subcategory}`;
            if (!stats[key]) stats[key] = 0;
            stats[key] += Number(t.amount);
        }
    });
    return stats;
  }, [transactions]);

  const maxCategoryValue = useMemo(() => {
    const values = Object.values(categoryStats);
    return Math.max(...values, 1);
  }, [categoryStats]);

  // ... (Mantenha as funções handle iguais) ...
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim(), newCategoryColor);
      setNewCategory('');
      setNewCategoryColor('#2DD4BF');
    }
  };

  const handleUpdateColor = async (id, newColor) => {
      await updateCategory(id, { color: newColor });
  };

  const handleUpdatePaymentColor = async (id, newColor) => {
      if (updatePaymentMethod) {
        await updatePaymentMethod(id, { color: newColor });
      }
  };

  const handleSaveCategoryName = async () => {
      if (editingCategory && editingCategory.name.trim()) {
          await updateCategory(editingCategory.id, { name: editingCategory.name });
          setEditingCategory(null);
      }
  };

  const handleSavePaymentName = async () => {
      if (editingPayment && editingPayment.name.trim()) {
          if (updatePaymentMethod) {
              await updatePaymentMethod(editingPayment.id, { name: editingPayment.name });
          }
          setEditingPayment(null);
      }
  };

  const handleSaveSubcategoryName = async (category) => {
      if (editingSub && editingSub.newName.trim()) {
          const updatedSubcats = category.subcategories.map(sub => 
              sub === editingSub.oldName ? editingSub.newName : sub
          );
          
          await updateCategory(category.id, { subcategories: updatedSubcats });
          setEditingSub(null);
      }
  };

  const handleAddSubcategory = async (category) => {
    if (!newSubcat.trim()) return;
    const currentSubcats = Array.isArray(category.subcategories) ? category.subcategories : [];
    const updatedSubcats = [...currentSubcats, newSubcat.trim()];
    
    await updateCategory(category.id, { subcategories: updatedSubcats });
    setNewSubcat(''); 
  };

  const handleRemoveSubcategory = async (category, subToRemove) => {
    const currentSubcats = Array.isArray(category.subcategories) ? category.subcategories : [];
    const updatedSubcats = currentSubcats.filter(s => s !== subToRemove);
    await updateCategory(category.id, { subcategories: updatedSubcats });
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim()) {
        if (addPaymentMethod) {
            addPaymentMethod(newPaymentMethod.trim(), newPaymentColor);
            setNewPaymentMethod('');
            setNewPaymentColor('#F472B6');
        }
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 pb-24"> 
        
        {/* --- CARD DE CATEGORIAS (MANTIDO IGUAL, APENAS RESUMIDO AQUI PARA FOCAR NO ERRO) --- */}
        <Card>
            <h3 className="font-bold text-lg text-teal dark:text-white mb-4 flex items-center gap-2 font-poppins">
                <Tag className="w-5 h-5 text-mint" /> Categorias e Subcategorias
            </h3>
            
            {/* Input Categoria */}
            <div className="flex gap-3 mb-6 items-center">
                <div className="relative w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm shrink-0 hover:border-mint transition-colors cursor-pointer group">
                    <input type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"/>
                </div>
                <input className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-teal dark:text-white text-sm outline-none focus:ring-2 focus:ring-mint transition-all min-w-0" placeholder="Nova Categoria..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()} />
                <button onClick={handleAddCategory} className="bg-mint text-white p-3 rounded-xl hover:bg-[#00b57a] transition-colors shrink-0 shadow-sm active:scale-95"><Plus size={20}/></button>
            </div>

            {/* Lista de Categorias */}
            <div className="space-y-4">
                {categories.map(cat => {
                    const totalVal = categoryStats[cat.name] || 0;
                    const isOpen = activeCategoryId === cat.id;
                    const isEditing = editingCategory && editingCategory.id === cat.id;
                    const percentage = (totalVal / maxCategoryValue) * 100;

                    return (
                    <div key={cat.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all shadow-sm">
                        <div className="flex flex-col p-4 gap-3">
                            <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <div className="relative w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm shrink-0 cursor-pointer" style={{ backgroundColor: cat.color || '#ccc' }}>
                                        <input type="color" value={cat.color || '#2DD4BF'} onChange={(e) => handleUpdateColor(cat.id, e.target.value)} onClick={(e) => e.stopPropagation()} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0 opacity-0"/>
                                    </div>
                                    
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input autoFocus type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleSaveCategoryName()} className="flex-1 text-sm font-bold text-gray-700 dark:text-gray-200 border-b-2 border-mint outline-none bg-transparent px-1 py-0.5 min-w-0"/>
                                            <button onClick={handleSaveCategoryName} className="text-green-500 hover:text-green-600 shrink-0"><Check size={18} /></button>
                                            <button onClick={() => setEditingCategory(null)} className="text-red-400 hover:text-red-500 shrink-0"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{cat.name}</span>
                                            <button onClick={() => setEditingCategory({ id: cat.id, name: cat.name })} className="text-gray-400 hover:text-teal dark:hover:text-mint transition-colors shrink-0"><Pencil size={14} /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="hidden md:block text-sm font-mono font-bold text-gray-600 dark:text-white">{formatCurrency(totalVal)}</span>
                                    <button onClick={() => setActiveCategoryId(isOpen ? null : cat.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isOpen ? 'bg-mint text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{isOpen ? 'Fechar' : 'Detalhes'}{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
                                    <button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden h-2">
                                    <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%`, backgroundColor: cat.color || '#2DD4BF', opacity: 0.8 }}></div>
                                </div>
                                <span className="md:hidden text-xs font-mono font-bold text-gray-600 dark:text-white whitespace-nowrap">{formatCurrency(totalVal)}</span>
                            </div>
                        </div>

                        {isOpen && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4"><Layers size={12} /> Subcategorias</div>
                                <div className="space-y-2 mb-4">
                                    {cat.subcategories && cat.subcategories.map((sub, idx) => {
                                        const subTotal = subcategoryStats[`${cat.name}-${sub}`] || 0;
                                        const isEditingSub = editingSub && editingSub.oldName === sub && editingSub.catId === cat.id;
                                        return (
                                            <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                                                    {isEditingSub ? (
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input autoFocus type="text" value={editingSub.newName} onChange={(e) => setEditingSub({...editingSub, newName: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleSaveSubcategoryName(cat)} className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-mint outline-none bg-transparent min-w-0"/>
                                                            <button onClick={() => handleSaveSubcategoryName(cat)} className="text-green-500 shrink-0"><Check size={14} /></button>
                                                            <button onClick={() => setEditingSub(null)} className="text-red-400 shrink-0"><X size={14} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                                            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">{sub}</span>
                                                            <button onClick={() => setEditingSub({ catId: cat.id, oldName: sub, newName: sub })} className="text-gray-400 hover:text-teal dark:hover:text-mint transition-colors shrink-0"><Pencil size={12} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-xs text-gray-500 dark:text-white font-mono">{formatCurrency(subTotal)}</span>
                                                    <button onClick={() => handleRemoveSubcategory(cat, sub)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={14} /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!cat.subcategories || cat.subcategories.length === 0) && (
                                        <div className="text-center py-2 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700"><p className="text-xs text-gray-400 italic">Nenhuma subcategoria.</p></div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Adicionar nova subcategoria..." className="flex-1 text-xs px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint shadow-sm" value={newSubcat} onChange={(e) => setNewSubcat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory(cat)}/>
                                    <button onClick={() => handleAddSubcategory(cat)} className="px-4 py-1 bg-white dark:bg-gray-700 text-teal dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm">+ Add</button>
                                </div>
                            </div>
                        )}
                    </div>
                    );
                })}
            </div>
        </Card>

        {/* --- CARD DE FORMAS DE PAGAMENTO (CORRIGIDO PARA MOBILE) --- */}
        <Card>
            <h3 className="font-bold text-lg text-teal dark:text-white mb-4 flex items-center gap-2 font-poppins">
                <CreditCard className="w-5 h-5 text-mint" /> Formas de Pagamento
            </h3>
            
            {/* Input Pagamento */}
            <div className="flex gap-3 mb-6 items-center">
                 <div className="relative w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm shrink-0 hover:border-mint transition-colors cursor-pointer group">
                    <input type="color" value={newPaymentColor} onChange={(e) => setNewPaymentColor(e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"/>
                </div>
                <input 
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-teal dark:text-white text-sm outline-none focus:ring-2 focus:ring-mint transition-all min-w-0" 
                    placeholder="Ex: Dinheiro, Débito..." 
                    value={newPaymentMethod} 
                    onChange={(e) => setNewPaymentMethod(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPaymentMethod()} 
                />
                <button onClick={handleAddPaymentMethod} className="bg-mint text-white p-3 rounded-xl hover:bg-[#00b57a] transition-colors shrink-0 shadow-sm active:scale-95"><Plus size={20}/></button>
            </div>

            {/* Lista Pagamentos - REMOVIDO max-h NO MOBILE PARA EVITAR SCROLL DUPLO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:max-h-[400px] md:overflow-y-auto md:pr-1 custom-scrollbar">
                {paymentMethods && paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => {
                        const isEditingPayment = editingPayment && editingPayment.id === method.id;

                        return (
                            <div key={method.id} className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm relative overflow-hidden group">
                                
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <div className="relative w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm shrink-0 cursor-pointer" style={{ backgroundColor: method.color || '#ccc' }}>
                                        <input type="color" value={method.color || '#F472B6'} onChange={(e) => handleUpdatePaymentColor(method.id, e.target.value)} className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0 opacity-0"/>
                                    </div>

                                    {isEditingPayment ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input autoFocus type="text" value={editingPayment.name} onChange={(e) => setEditingPayment({...editingPayment, name: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleSavePaymentName()} className="flex-1 text-sm font-bold text-gray-700 dark:text-gray-200 border-b-2 border-mint outline-none bg-transparent px-1 py-0.5 min-w-0"/>
                                            <button onClick={handleSavePaymentName} className="text-green-500 hover:text-green-600 shrink-0"><Check size={18} /></button>
                                            <button onClick={() => setEditingPayment(null)} className="text-red-400 hover:text-red-500 shrink-0"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">{method.name}</span>
                                            <button onClick={() => setEditingPayment({ id: method.id, name: method.name })} className="text-gray-400 hover:text-teal dark:hover:text-mint transition-colors shrink-0"><Pencil size={14} /></button>
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => deletePaymentMethod(method.id)} className="text-gray-300 hover:text-red-500 p-1.5 transition-colors shrink-0"><Trash2 size={16} /></button>
                            </div>
                        );
                    })
                ) : (
                    <p className="col-span-full text-sm text-gray-400 text-center py-4 italic">Nenhuma forma de pagamento cadastrada.</p>
                )}
            </div>
        </Card>
    </div>
  );
};

export default CategoriesView;