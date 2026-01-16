import React, { useState } from "react";
import { Heart, X, Shield, FileText, Lock } from "lucide-react";

const LEGAL_CONTENT = {
  privacy: (
    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex gap-3 text-emerald-800 text-sm mb-4">
        <Lock className="w-5 h-5 flex-shrink-0" />
        <p>Sua segurança é nossa prioridade. Utilizamos criptografia de nível bancário em trânsito e em repouso.</p>
      </div>
      
      <p>
        <strong>1. Coleta de Informações:</strong>
        <br />
        Coletamos apenas o necessário para o funcionamento do serviço: dados de cadastro (nome, e-mail) e os dados financeiros que você insere manualmente (receitas, despesas e categorias).
      </p>
      
      <p>
        <strong>2. Uso dos Dados:</strong>
        <br />
        Seus dados financeiros são utilizados exclusivamente para gerar seus gráficos e relatórios. <strong>Nós não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros</strong> para fins de marketing.
      </p>

      <p>
        <strong>3. Processamento de Pagamentos:</strong>
        <br />
        Para assinaturas do plano Pro, utilizamos o <strong>Stripe</strong>, uma das plataformas de pagamento mais seguras do mundo. Nós não armazenamos os dados do seu cartão de crédito em nossos servidores.
      </p>

      <p>
        <strong>4. Seus Direitos:</strong>
        <br />
        Você tem total controle. Pode exportar seus dados ou solicitar a exclusão completa da sua conta e de todas as informações associadas a qualquer momento através do painel de configurações.
      </p>
    </div>
  ),
  terms: (
    <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
      <p>
        <strong>1. O Serviço:</strong>
        <br />
        O GerenciaDin é uma plataforma SaaS (Software as a Service) de gestão financeira pessoal. Oferecemos ferramentas para organização de receitas, despesas e visualização de relatórios.
      </p>

      <p>
        <strong>2. Planos e Assinaturas:</strong>
        <br />
        O sistema oferece um plano Gratuito (com limitações) e um plano Pro (assinatura). Ao assinar o plano Pro, você concorda com a cobrança recorrente (mensal ou anual) processada de forma segura. O cancelamento pode ser feito a qualquer momento para evitar renovações futuras.
      </p>

      <p>
        <strong>3. Responsabilidades:</strong>
        <br />
        O usuário é responsável por manter a confidencialidade de sua senha. O GerenciaDin não se responsabiliza por perdas decorrentes de acesso não autorizado causado por descuido do usuário com suas credenciais.
      </p>

      <p>
        <strong>4. Isenção de Responsabilidade Financeira:</strong>
        <br />
        Nossos relatórios são informativos. O GerenciaDin não oferece consultoria financeira, fiscal ou de investimentos. Decisões econômicas tomadas com base nos dados da plataforma são de inteira responsabilidade do usuário.
      </p>

      <p>
        <strong>5. Disponibilidade:</strong>
        <br />
        Nos esforçamos para manter o serviço disponível 99.9% do tempo, mas interrupções para manutenção ou atualizações podem ocorrer.
      </p>
    </div>
  )
};

const Modal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
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
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
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
                © {new Date().getFullYear()} GerenciaDin. Todos os direitos reservados.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-600">
              <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition-colors">Funções</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition-colors">Como usar</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-600 transition-colors">Planos</button>
              <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-600 transition-colors">FAQ</button>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <button onClick={() => setActiveModal('privacy')} className="hover:text-emerald-600 transition-colors">Privacidade</button>
              <button onClick={() => setActiveModal('terms')} className="hover:text-emerald-600 transition-colors">Termos de Uso</button>
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
        title="Política de Privacidade"
        icon={Shield}
      >
        {LEGAL_CONTENT.privacy}
      </Modal>

      <Modal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)}
        title="Termos de Uso"
        icon={FileText}
      >
        {LEGAL_CONTENT.terms}
      </Modal>
    </>
  );
};

export default Footer;