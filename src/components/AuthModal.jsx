import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Mail, Lock, User, ArrowRight, Eye, EyeOff, KeyRound, ArrowLeft, X
} from 'lucide-react';
import { supabase, signInWithEmail, signUpWithEmail } from '../config/supabase';
import Input from './UI/Input';
import Button from './UI/Button';
import Logo from './UI/Logo';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [view, setView] = useState('login'); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        setView('login');
        setError('');
        setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validatePasswordStrength = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    if (!isLongEnough) return "Mínimo 8 caracteres.";
    if (!hasUpperCase) return "Precisa de 1 letra maiúscula.";
    if (!hasSpecialChar) return "Precisa de 1 caractere especial.";
    return null;
  };

  const switchView = (newView) => {
    setView(newView);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setRecoverySent(false);
    setIsSuccess(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, 
        },
      });
      if (error) throw error;
    } catch (err) {
      setError("Erro ao conectar com Google.");
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, 
      });

      if (error) throw error;
      setRecoverySent(true);
    } catch (err) {
      setError(err.message || "Erro ao enviar email de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (view === 'login') {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;
        if (data.user) {
            onLogin(data.user);
            onClose(); 
        }

      } else if (view === 'signup') {
        if (password !== confirmPassword) throw new Error("As senhas não coincidem.");
        const passwordError = validatePasswordStrength(password);
        if (passwordError) throw new Error(passwordError);

        const { data, error } = await signUpWithEmail(email, password, name);
        if (error) throw error;
        
        if (data?.user && data?.session === null) {
          setIsSuccess(true);
        } else if (data.user) {
          onLogin(data.user);
          onClose();
        }
      }
    } catch (err) {
      let msg = err.message || "Erro ao processar.";
      if (msg.includes('Invalid login')) msg = "Credenciais inválidas.";
      if (msg.includes('already registered')) msg = "Email já cadastrado.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { paddingLeft: '2.5rem' }; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-scale-in">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
            <X size={20} />
        </button>

        <div className="p-8">
            {view === 'recovery' && (
                <>
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="bg-mint/10 p-3 rounded-full">
                                <KeyRound className="w-8 h-8 text-mint" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-teal dark:text-white font-poppins">Recuperar Senha</h2>
                        <p className="text-gray-500 text-xs mt-2">
                            Digite seu email para receber um link de redefinição.
                        </p>
                    </div>

                    {recoverySent ? (
                        <div className="text-center animate-fadeIn">
                            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-xs mb-4">
                                Email enviado! Verifique sua caixa de entrada e spam.
                            </div>
                            <Button onClick={() => switchView('login')} variant="primary" className="w-full">
                                Voltar para Login
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordRecovery} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-500 p-2 rounded text-xs flex gap-2 items-center">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}
                            <div className="relative group">
                                <div className="absolute left-3 top-2.5 text-gray-400 z-10"><Mail className="w-4 h-4" /></div>
                                <Input 
                                    type="email" 
                                    placeholder="seu@email.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    style={inputStyle}
                                    className="!py-2 text-xs"
                                />
                            </div>
                            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar Link"}
                            </Button>
                            <button 
                                type="button"
                                onClick={() => switchView('login')}
                                className="w-full text-center text-xs text-gray-400 hover:text-teal mt-2 flex items-center justify-center gap-1"
                            >
                                <ArrowLeft size={12} /> Voltar
                            </button>
                        </form>
                    )}
                </>
            )}

            {view !== 'recovery' && (
                <>
                    {isSuccess ? (
                        <div className="text-center animate-fadeIn">
                            <div className="flex justify-center mb-6">
                                <div className="bg-mint/10 p-4 rounded-full"><Mail className="w-10 h-10 text-mint" /></div>
                            </div>
                            <h2 className="text-xl font-bold text-teal dark:text-white font-poppins mb-3">Verifique seu e-mail!</h2>
                            <p className="text-gray-500 text-xs mb-8 leading-relaxed">
                                Enviamos um link de confirmação para <strong className="text-teal dark:text-gray-300">{email}</strong>.
                            </p>
                            <Button onClick={() => switchView('login')} variant="primary" className="w-full text-sm py-2.5">
                                Voltar para Login
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <div className="flex w-full justify-center items-center mb-4">
                                    <Logo size="medium" centered={true} className="mx-auto" />
                                </div>
                                <h2 className="text-xl font-bold text-teal dark:text-white font-poppins">
                                    {view === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
                                </h2>
                                <p className="text-gray-500 text-[10px] mt-1">
                                    {view === 'login' ? 'Entre com Google ou insira seus dados.' : 'Preencha os campos para começar.'}
                                </p>
                            </div>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium py-2.5 rounded-xl shadow-sm text-xs"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continuar com Google
                                </button>
                                
                                <div className="flex items-center gap-2 my-4">
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                                    <span className="text-[10px] text-gray-400">ou com email</span>
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 px-3 py-2 rounded-r-lg text-[10px] flex items-center gap-2 mb-4 animate-fadeIn">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {view === 'signup' && (
                                    <div className="animate-fadeIn">
                                        <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Nome</label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-2.5 text-gray-400 z-10"><User className="w-4 h-4" /></div>
                                            <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} className="!py-2 text-xs" />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Email</label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-2.5 text-gray-400 z-10"><Mail className="w-4 h-4" /></div>
                                        <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} className="!py-2 text-xs" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1 ml-1">
                                        <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300">Senha</label>
                                        {view === 'login' && (
                                            <button type="button" onClick={() => switchView('recovery')} className="text-[10px] text-mint font-bold hover:underline">
                                                Esqueceu a senha?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-2.5 text-gray-400 z-10"><Lock className="w-4 h-4" /></div>
                                        <Input type={showPassword ? "text" : "password"} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} className="!py-2 text-xs" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-teal">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {view === 'signup' && (
                                    <div className="animate-fadeIn">
                                        <label className="block text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Confirmar Senha</label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-2.5 text-gray-400 z-10"><Lock className="w-4 h-4" /></div>
                                            <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} className="!py-2 text-xs" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-teal">
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-gray-400 mt-1 ml-1 leading-tight">Mín. 8 caracteres, 1 maiúscula, 1 especial.</p>
                                    </div>
                                )}
                                
                                <Button type="submit" variant="primary" className="w-full !py-2.5 text-xs font-bold shadow-lg shadow-mint/20 mt-2" disabled={loading}>
                                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : <span className="flex items-center justify-center gap-2">{view === 'login' ? 'Entrar' : 'Cadastrar'} <ArrowRight className="w-3 h-3" /></span>}
                                </Button>
                            </form>

                            <div className="mt-4 text-center border-t border-gray-100 dark:border-gray-800 pt-4">
                                <p className="text-gray-600 dark:text-gray-400 text-[10px]">
                                    {view === 'login' ? 'Ainda não tem uma conta?' : 'Já possui cadastro?'}
                                    <button onClick={() => switchView(view === 'login' ? 'signup' : 'login')} className="ml-2 text-teal font-bold hover:text-mint transition-colors">
                                        {view === 'login' ? 'Cadastre-se' : 'Fazer Login'}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;