import React, { useState } from 'react';
import { 
  AlertCircle, Mail, Lock, User, ArrowRight, Eye, EyeOff, KeyRound, ArrowLeft 
} from 'lucide-react';
import { supabase, signInWithEmail, signUpWithEmail } from '../config/supabase'; // Importe supabase aqui também
import Input from './UI/Input';
import Button from './UI/Button';
import Logo from './UI/Logo';

import loginBgImage from '../assets/login-bg.png'; 

const AuthScreen = ({ onLogin }) => {
  // Estados de visualização: 'login', 'signup', 'recovery'
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

  // Validação de senha
  const validatePasswordStrength = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    if (!isLongEnough) return "Mínimo 8 caracteres.";
    if (!hasUpperCase) return "Precisa de 1 letra maiúscula.";
    if (!hasSpecialChar) return "Precisa de 1 caractere especial.";
    return null;
  };

  // Resetar formulários ao trocar de tela
  const switchView = (newView) => {
    setView(newView);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setRecoverySent(false);
    setIsSuccess(false);
  };

  // Função para lidar com "Esqueceu a Senha"
  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Redireciona para o site após clicar no email
      });

      if (error) throw error;
      setRecoverySent(true);
    } catch (err) {
      setError(err.message || "Erro ao enviar email de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  // Função principal de Login/Cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (view === 'login') {
        const { data, error } = await signInWithEmail(email, password);
        if (error) throw error;
        if (data.user) onLogin(data.user);

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

  // --- Renderização da Tela de Recuperação ---
  if (view === 'recovery') {
    return (
      <div className="h-screen flex w-full font-inter bg-white dark:bg-gray-900 overflow-hidden items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl p-8">
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
                Email enviado! Verifique sua caixa de entrada.
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
        </div>
      </div>
    );
  }

  // --- Renderização Padrão (Login / Cadastro) ---
  return (
    <div className="h-screen flex w-full font-inter bg-white dark:bg-gray-900 overflow-hidden">
      
      {/* LADO ESQUERDO */}
      <div className="hidden lg:flex w-2/3 h-full bg-teal-900 items-center justify-center relative">
        <img src={loginBgImage} alt="Banner GerenciaDin" className="w-full h-full object-cover object-left" />
      </div>

      {/* LADO DIREITO */}
      <div className="w-full lg:w-1/3 h-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 shadow-xl z-10">
        <div className="w-full max-w-sm flex flex-col justify-center h-full max-h-[800px]"> 
          
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
              <div className="text-center lg:text-left mb-6">
                <div className="lg:hidden flex justify-center mb-4"><Logo size="medium" /></div>
                <h2 className="text-xl font-bold text-teal dark:text-white font-poppins">
                  {view === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
                </h2>
                <p className="text-gray-500 text-[10px] mt-1">
                  {view === 'login' ? 'Insira seus dados para entrar.' : 'Preencha os campos para começar.'}
                </p>
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
          <div className="text-center text-[9px] text-gray-300 dark:text-gray-600 mt-4">© 2025 GerenciaDin. Todos os direitos reservados.</div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;