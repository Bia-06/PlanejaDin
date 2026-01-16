import React, { useState, useRef } from 'react';
import { 
  User, Camera, Sun, Moon, LogOut, 
  Mail, Lock, Phone, Eye, EyeOff, Loader, Trash2, Info,
  Crown, ShieldCheck, Zap, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { supabase } from '../config/supabase'; 
import Card from './UI/Card';
import Input from './UI/Input';
import Button from './UI/Button';

const SettingsView = ({ 
  user, 
  isDarkMode, 
  setIsDarkMode,
  onLogout,
  isPro,
  customRole
}) => {
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    password: '',
    confirmPassword: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.user_metadata?.avatar_url || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
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

  const handleLogoutClick = () => {
      setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      alert("Erro ao sair.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmationInput('');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmationInput !== 'DELETAR') return;

    setIsDeleting(true);
    try {
        const { error } = await supabase.rpc('delete_own_account');

        if (error) throw error;
        
        await onLogout();
        
        alert("Sua conta foi excluída permanentemente.");
        window.location.reload(); 

    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Erro ao processar exclusão: " + error.message);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
    }
  };

  const inputStyle = { paddingLeft: '3.5rem', paddingRight: '3rem' };
  const passwordInputStyle = { paddingLeft: '3.5rem', paddingRight: '3rem' };
  const passwordRequirements = validatePasswordRequirements(formData.password);

  const renderPlanCard = () => {
    if (customRole === 'Desenvolvedora') {
        return (
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={80} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-white/20 p-1.5 rounded-lg"><Zap size={20} className="text-yellow-300" /></div>
                        <span className="font-bold text-sm uppercase tracking-wider text-purple-100">Nível Dev</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Desenvolvedora</h3>
                    <p className="text-purple-100 text-sm mb-4">Acesso irrestrito ao sistema.</p>
                    <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Tudo Ilimitado</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Admin</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isPro) {
        return (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-lg mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Crown size={80} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-white/20 p-1.5 rounded-lg"><Crown size={20} className="text-yellow-200" /></div>
                        <span className="font-bold text-sm uppercase tracking-wider text-amber-100">Premium</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Plano Pro</h3>
                    <p className="text-amber-100 text-sm mb-4">Sua gestão financeira no nível máximo.</p>
                    <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Transações Ilimitadas</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Relatórios</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Subcategorias</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> Formas de Pagamentos</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={12}/> E muito mais!</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm mb-6 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
                <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg"><ShieldCheck size={20} className="text-gray-500 dark:text-gray-400" /></div>
                        <span className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Básico</span>
                    </div>
                    <h3 className="text-xl font-bold text-teal dark:text-white mb-1">Plano Gratuito</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Funcionalidades essenciais ativas.</p>
                </div>
                <Button className="text-xs px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 hover:shadow-md transition-all font-bold shadow-sm">
                    Fazer Upgrade
                </Button>
            </div>
            <div className="space-y-2 mt-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gray-400 h-full w-[70%]"></div>
                </div>
                <p className="text-xs text-gray-400 text-right">Limite de recursos aplicável</p>
            </div>
        </div>
    );
  };

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

        <div>
          
          {renderPlanCard()}

          <div className="space-y-6">
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
  
                <button 
                    onClick={handleLogoutClick}
                    disabled={isLoggingOut}
                    className="w-full p-4 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
                >
                    {isLoggingOut ? <Loader className="animate-spin w-5 h-5" /> : <><LogOut size={20} /> Sair da Conta</>}
                </button>

                <button 
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="w-full p-4 mt-2 flex items-center justify-center gap-2 text-red-600/80 dark:text-red-400/80 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors border border-dashed border-red-200 dark:border-red-800"
                >
                    {isDeleting ? <Loader className="animate-spin w-4 h-4" /> : <><Trash2 size={18} /> Excluir Conta</>}
                </button>
              </div>
            </Card>

            <div className="hidden md:block">
              <Card className="opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3 mb-2">
                  <Info className="w-5 h-5 text-mint" />
                  <h3 className="font-bold text-teal dark:text-white">Sobre o App</h3>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p className="flex justify-between"><span>Versão Atual:</span><span className="font-mono font-bold text-teal dark:text-white">v1.1.0</span></p>
                      <p className="flex justify-between"><span>Última Atualização:</span><span>16 JAN 2026</span></p>
                  <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-400">
                      Feito com 💜 por <a href="https://portfolio--beatriz.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-mint font-bold hover:underline transition-all">Beatriz Pires</a>
                  </div>
                  </div>
              </Card>
            </div>

          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scaleIn border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-500">
                <LogOut size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Deseja sair?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar seus dados.
              </p>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                >
                  {isLoggingOut ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : "Sair"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scaleIn border-2 border-red-100 dark:border-red-900/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 animate-pulse">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Excluir Conta Permanentemente
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                <span className="font-bold text-red-500">Atenção!</span> Essa ação é irreversível. Todos os seus dados, transações e configurações serão apagados.
              </p>

              <div className="w-full mb-6">
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Para confirmar, digite <span className="text-red-500 select-all">DELETAR</span> abaixo:
                </label>
                <input 
                    type="text" 
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    placeholder="DELETAR"
                    className="w-full text-center font-bold text-red-600 border-2 border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-all"
                />
              </div>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDeleteAccount}
                  disabled={deleteConfirmationInput !== 'DELETAR' || isDeleting}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${deleteConfirmationInput === 'DELETAR' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70'}`}
                >
                  {isDeleting ? <Loader className="animate-spin w-5 h-5" /> : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;