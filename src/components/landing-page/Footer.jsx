import React, { useState } from "react";
import { Heart, X, Shield, AlertTriangle } from "lucide-react";

const LEGAL_CONTENT = {
  privacy: (
    <div className="space-y-4 text-slate-600">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm mb-4">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p>Este aplicativo está em fase <strong>BETA PÚBLICO</strong>. Funcionalidades podem mudar sem aviso prévio.</p>
      </div>
      <p>
        <strong>1. Coleta de Dados:</strong> Para o funcionamento do sistema, armazenamos as informações de receitas e despesas que você cadastra. Seus dados são seus e não são vendidos para terceiros.
      </p>
      <p>
        <strong>2. Segurança:</strong> Utilizamos protocolos padrão de segurança, mas como software em fase de testes, recomendamos não utilizar senhas que você usa em bancos ou serviços críticos.
      </p>
      <p>
        <strong>3. Exclusão:</strong> Você pode solicitar a exclusão completa dos seus dados a qualquer momento entrando em contato com a desenvolvedora.
      </p>
    </div>
  ),
  terms: (
    <div className="space-y-4 text-slate-600">
      <p>
        <strong>1. Uso:</strong> O GerenciaDin é fornecido "no estado em que se encontra". Embora nos esforcemos para garantir a precisão dos cálculos, não nos responsabilizamos por decisões financeiras tomadas com base neles.
      </p>
      <p>
        <strong>2. Fase Beta:</strong> Ao utilizar o sistema agora, você entende que bugs podem ocorrer e que o histórico de dados pode sofrer resets (com aviso prévio sempre que possível) para atualizações de estrutura.
      </p>
      <p>
        <strong>3. Gratuidade:</strong> Durante o período Beta, todas as funcionalidades estão liberadas gratuitamente para fins de teste e feedback.
      </p>
    </div>
  )
};

const Modal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <footer className="bg-white border-t border-slate-100 py-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="text-center md:text-left space-y-2">
              <div 
                className="flex items-center justify-center md:justify-start gap-2 font-display font-bold text-xl cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                   <img src="/pwa-192x192.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-slate-900">Gerencia<span className="text-emerald-600">Din</span></span>
              </div>
              <p className="text-slate-400 text-xs">
                © 2026 GerenciaDin. Todos os direitos reservados.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-600">
              <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition-colors">Funções</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition-colors">Como usar</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-600 transition-colors">Planos</button>
              <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-600 transition-colors">FAQ</button>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <button onClick={() => setActiveModal('privacy')} className="hover:text-emerald-600 transition-colors">Privacidade</button>
              <button onClick={() => setActiveModal('terms')} className="hover:text-emerald-600 transition-colors">Termos</button>
            </nav>

            <div className="flex items-center justify-center md:justify-end">
              <a 
                href="https://portfolio--beatriz.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs text-slate-500 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 rounded-full border border-slate-200 hover:border-emerald-200 transition-all duration-300"
              >
                <span>Feito com</span>
                <Heart className="w-3 h-3 text-red-400 fill-red-400 group-hover:scale-110 transition-transform" />
                <span>por</span>
                <span className="font-bold">Beatriz Pires</span>
              </a>
            </div>

          </div>
        </div>
      </footer>

      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)}
        title="Política de Privacidade (Beta)"
        icon={Shield}
      >
        {LEGAL_CONTENT.privacy}
      </Modal>

      <Modal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)}
        title="Termos de Uso (Beta)"
        icon={AlertTriangle}
      >
        {LEGAL_CONTENT.terms}
      </Modal>
    </>
  );
};

export default Footer;