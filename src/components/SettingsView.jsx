import React, { useState, useRef } from 'react';
import { 
  User, Camera, Tag, Plus, X, Sun, Moon, LogOut, 
  Mail, Lock, Phone, Info, Eye, EyeOff, Loader, Trash2 
} from 'lucide-react';
import { supabase } from '../config/supabase'; 
import Card from './UI/Card';
import Input from './UI/Input';
import Button from './UI/Button';

const SettingsView = ({ 
  user, 
  categories = [], 
  isDarkMode, 
  setIsDarkMode,
  addCategory,
  updateCategory, // Recebendo a função update
  deleteCategory,
  onLogout 
}) => {
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    password: '',
    confirmPassword: ''
  });

  const [newCategory, setNewCategory] = useState('');
  
  // Estados para gerenciar subcategorias
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [newSubcat, setNewSubcat] = useState('');

  const [avatarPreview, setAvatarPreview] = useState(user?.user_metadata?.avatar_url || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 11);
    if (limitedNumbers.length <= 2) return `(${limitedNumbers}`;
    else if (limitedNumbers.length <= 7) return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    else if (limitedNumbers.length <= 11) return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    return value;
  };

  const validatePasswordRequirements = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, phone: formatPhoneNumber(value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') { handlePhoneChange(e); return; }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar imagem. Verifique se criou o bucket "avatars" no Supabase.');
      return null;
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  // --- Lógica de Subcategorias ---
const handleAddSubcategory = async (category) => {
    if (!newSubcat.trim()) return;
    
    // Garante que currentSubcats seja um array, mesmo se vier null do banco
    const currentSubcats = Array.isArray(category.subcategories) ? category.subcategories : [];
    const updatedSubcats = [...currentSubcats, newSubcat.trim()];

    console.log("Tentando salvar:", updatedSubcats); // Para debug

    const { error } = await updateCategory(category.id, { subcategories: updatedSubcats });
    
    if (error) {
        alert("Erro ao salvar subcategoria: " + error.message);
    } else {
        setNewSubcat(''); // Limpa o input apenas se deu certo
    }
  };

  const handleSaveProfile = async () => {
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (formData.phone && phoneNumbers.length < 10) {
      alert("Telefone inválido!");
      return;
    }
    
    if (formData.password) {
      const reqs = validatePasswordRequirements(formData.password);
      if (!reqs.length || !reqs.uppercase || !reqs.specialChar) {
        alert("A senha não atende aos requisitos de segurança.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem!");
        return;
      }
    }

    setIsSaving(true);

    try {
      let avatarUrl = user?.user_metadata?.avatar_url;

      if (fileInputRef.current?.files?.length > 0) {
        const file = fileInputRef.current.files[0];
        const newUrl = await uploadAvatar(file);
        if (newUrl) avatarUrl = newUrl;
      }

      const updates = {
        data: {
          name: formData.name,
          phone: formData.phone,
          avatar_url: avatarUrl
        }
      };

      if (formData.password) {
        updates.password = formData.password;
      }

      if (formData.email !== user.email) {
        updates.email = formData.email;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar perfil: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Tem certeza que deseja sair da conta?")) {
      setIsLoggingOut(true);
      try {
        await onLogout();
      } catch (error) {
        alert("Erro ao sair.");
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("ATENÇÃO: Essa ação é irreversível!\n\nIsso apagará TODOS os seus dados (transações, categorias, lembretes). Tem certeza absoluta?");
    
    if (confirmation) {
        const doubleCheck = window.prompt("Digite 'DELETAR' para confirmar a exclusão:");
        if (doubleCheck !== 'DELETAR') return;

        setIsDeleting(true);
        try {
            await supabase.from('transactions').delete().eq('user_id', user.id);
            await supabase.from('reminders').delete().eq('user_id', user.id);
            await supabase.from('categories').delete().eq('user_id', user.id);
            await onLogout();
            alert("Sua conta foi limpa e desativada.");
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
            alert("Erro ao processar exclusão. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    }
  };

  const inputStyle = { paddingLeft: '3.5rem', paddingRight: '3rem' };
  const passwordInputStyle = { paddingLeft: '3.5rem', paddingRight: '3rem' };
  const passwordRequirements = validatePasswordRequirements(formData.password);

  return (
    <div className="animate-fadeIn pb-24 font-inter">
      <h2 className="text-2xl font-bold mb-6 text-teal dark:text-white font-poppins">Configurações</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card>
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative group cursor-pointer mb-4"
              onClick={handleImageClick}
            >
              <div className="w-32 h-32 bg-teal rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-mint shadow-lg transition-transform hover:scale-105 relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  formData.name ? formData.name.charAt(0).toUpperCase() : <User size={48} />
                )}
                
                {isSaving && fileInputRef.current?.files?.length > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader className="animate-spin text-white" />
                  </div>
                )}
              </div>
              
              <div className="absolute bottom-0 right-0 p-2.5 bg-teal rounded-full border-4 border-white dark:border-gray-800 shadow-sm z-10">
                <Camera className="text-white w-5 h-5" />
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <h3 className="font-bold text-xl text-teal dark:text-white font-poppins">{formData.name || 'Usuário'}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Toque na foto para editar</p>
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 w-5 h-5 text-gray-400 z-10" />
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome" style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 w-5 h-5 text-gray-400 z-10" />
                  <Input name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" style={inputStyle} />
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Telefone</label>
                  <div className="relative">
                  <Phone className="absolute left-4 top-3 w-5 h-5 text-gray-400 z-10" />
                  <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" style={inputStyle} maxLength={15} />
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Nova Senha</label>
                  <div className="relative">
                  <Lock className="absolute left-4 top-3 w-5 h-5 text-gray-400 z-10" />
                  <Input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="********" style={passwordInputStyle} />
                  <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-teal dark:hover:text-gray-300 z-10" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Confirmar Senha</label>
                  <div className="relative">
                  <Lock className="absolute left-4 top-3 w-5 h-5 text-gray-400 z-10" />
                  <Input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="********" style={passwordInputStyle} />
                  <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-teal dark:hover:text-gray-300 z-10" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {(formData.password || formData.confirmPassword) && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  {formData.password && formData.confirmPassword && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${formData.password === formData.confirmPassword ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${formData.password === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formData.password === formData.confirmPassword ? 'Senhas coincidem ✓' : 'Senhas não coincidem ✗'}
                      </span>
                    </div>
                  )}
                  {formData.password.length > 0 && (
                    <div className="text-xs space-y-1.5">
                        <div className={`flex items-center gap-1.5 ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}><div className={`w-2 h-2 rounded-full ${passwordRequirements.length ? 'bg-green-500' : 'bg-red-500'}`}></div> 8+ caracteres</div>
                        <div className={`flex items-center gap-1.5 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}><div className={`w-2 h-2 rounded-full ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-red-500'}`}></div> Maiúscula</div>
                        <div className={`flex items-center gap-1.5 ${passwordRequirements.specialChar ? 'text-green-600' : 'text-red-600'}`}><div className={`w-2 h-2 rounded-full ${passwordRequirements.specialChar ? 'bg-green-500' : 'bg-red-500'}`}></div> Especial</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveProfile} variant="primary" className="w-full flex items-center justify-center gap-2" disabled={isSaving}>
                {isSaving ? <><Loader className="animate-spin w-5 h-5" /> Salvando...</> : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-lg text-teal dark:text-white mb-4 flex items-center gap-2 font-poppins">
              <Tag className="w-5 h-5 text-mint" /> Gerenciar Categorias
            </h3>
            
            <div className="flex gap-2 mb-4">
              <input className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-teal dark:text-white text-sm outline-none focus:ring-2 focus:ring-mint transition-all min-w-0" placeholder="Nova Categoria..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()} />
              <button onClick={handleAddCategory} className="bg-mint text-white p-2 rounded-xl hover:bg-[#00b57a] transition-colors shrink-0"><Plus size={20}/></button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {categories.map(cat => (
                <div key={cat.id} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-bgLight dark:bg-gray-700/50">
                  <div className="flex justify-between items-center p-3">
                    <span className="text-sm font-bold text-teal dark:text-gray-200 truncate">{cat.name}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveCategoryId(activeCategoryId === cat.id ? null : cat.id)}
                            className={`p-1.5 rounded-lg transition-colors ${activeCategoryId === cat.id ? 'bg-mint text-white' : 'text-gray-400 hover:text-mint hover:bg-mint/10'}`}
                            title="Gerenciar Subcategorias"
                        >
                            <Tag size={16} />
                        </button>
                        <button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 p-1.5"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Área de Subcategorias */}
                  {activeCategoryId === cat.id && (
                     <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 animate-fadeIn">
                         <p className="text-xs text-gray-500 mb-2 font-medium">Subcategorias:</p>
                         
                         <div className="flex flex-wrap gap-2 mb-3">
                             {cat.subcategories && cat.subcategories.map((sub, idx) => (
                                 <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md border border-gray-200 dark:border-gray-600">
                                     {sub}
                                     <button onClick={() => handleRemoveSubcategory(cat, sub)} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                                 </span>
                             ))}
                             {(!cat.subcategories || cat.subcategories.length === 0) && (
                                 <span className="text-xs text-gray-400 italic">Nenhuma subcategoria.</span>
                             )}
                         </div>

                         <div className="flex gap-2">
                             <input 
                                 type="text" 
                                 placeholder="Add sub..." 
                                 className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent dark:text-white focus:outline-none focus:border-mint"
                                 value={newSubcat}
                                 onChange={(e) => setNewSubcat(e.target.value)}
                                 onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory(cat)}
                             />
                             <button 
                                  onClick={() => handleAddSubcategory(cat)}
                                  className="px-3 py-1 bg-mint text-white rounded-lg text-xs font-bold hover:bg-teal transition-colors"
                             >
                                 Add
                             </button>
                         </div>
                     </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-lg text-teal dark:text-white mb-4 font-poppins">Preferências</h3>
            <div 
                className="flex items-center justify-between p-4 bg-bgLight dark:bg-gray-700/50 rounded-xl mb-4 cursor-pointer active:scale-[0.98] transition-transform" 
                onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="text-teal dark:text-white w-5 h-5" /> : <Sun className="text-yellow w-5 h-5" />}
                <span className="text-teal font-medium dark:text-gray-200">Modo Escuro</span>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-mint' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <Button onClick={handleLogout} variant="secondary" className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 hover:bg-gray-100" disabled={isLoggingOut}>
                {isLoggingOut ? <Loader className="animate-spin w-4 h-4" /> : <><LogOut className="w-5 h-5" /> Sair da Conta</>}
              </Button>

              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-bold mt-2"
              >
                 {isDeleting ? <Loader className="animate-spin w-4 h-4" /> : <><Trash2 className="w-4 h-4" /> Excluir Conta</>}
              </button>
            </div>
          </Card>

          <Card className="opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 mb-2">
              <Info className="w-5 h-5 text-mint" />
              <h3 className="font-bold text-teal dark:text-white">Sobre o App</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
               <p className="flex justify-between"><span>Versão Atual:</span><span className="font-mono font-bold text-teal dark:text-white">v1.0.0 (Beta)</span></p>
               <p className="flex justify-between"><span>Última Atualização:</span><span>02 JAN 2026</span></p>
              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-400">
                Feito com 💜 por <a href="https://portfolio--beatriz.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-mint font-bold hover:underline transition-all">Beatriz Pires</a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;