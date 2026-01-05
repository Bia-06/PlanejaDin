import React, { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { Menu, X, ChevronRight } from "lucide-react";

const Header = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <header
        className={`
          relative transition-all duration-500 ease-in-out border-2
          flex items-center justify-between bg-white shadow-lg
          ${
            isScrolled
              ? "w-full max-w-5xl border-emerald-100 py-2 px-4 sm:px-6 rounded-full shadow-emerald-900/5"
              : "w-full max-w-6xl border-emerald-50/50 py-3 px-4 sm:py-4 sm:px-8 rounded-full shadow-sm"
          }
        `}
      >
        <div 
          className="relative z-20 flex items-center gap-2 font-display font-bold text-xl md:text-2xl cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="flex items-center justify-center rounded-full overflow-hidden shadow-md w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0">
            <img 
              src="/logo-header.png" 
              alt="Logo" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>

          <span className="tracking-tight hidden sm:block">
            <span className="text-slate-900">Gerencia</span>
            <span className="text-emerald-400">Din</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-200">
          {[
            { id: "features", label: "Funções" },
            { id: "how-it-works", label: "Como usar" },
            { id: "pricing", label: "Planos" },
            { id: "faq", label: "FAQ" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-white px-5 py-2 rounded-full transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={`
            flex items-center gap-2
            /* Mobile: Posicionamento Absoluto Centralizado */
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            /* Desktop: Volta ao fluxo normal */
            lg:static lg:transform-none lg:gap-3
        `}>
          
          <Button 
            variant="ghost" 
            onClick={onLoginClick} 
            className="text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full font-medium
                       px-3 h-8 text-xs          // Mobile: compacto
                       sm:px-5 sm:h-10 sm:text-base // Desktop: normal
            "
          >
            Entrar
          </Button>

          <Button 
            onClick={onLoginClick} 
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald transition-all duration-300 font-semibold
                       h-8 px-4 text-xs          // Mobile
                       sm:h-10 sm:px-6 sm:text-base // Desktop
            "
          >
            Começar
            <ChevronRight className="ml-1 w-4 h-4 hidden sm:block" />
          </Button>
        </div>

        <div className="lg:hidden relative z-20">
          <button
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border-2 border-emerald-100 rounded-[2rem] p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5 fade-in duration-200 mx-1 z-50">
            <nav className="flex flex-col gap-2">
              {[
                { id: "features", label: "Funções" },
                { id: "how-it-works", label: "Como usar" },
                { id: "pricing", label: "Planos" },
                { id: "faq", label: "FAQ" },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-left p-4 hover:bg-emerald-50 rounded-2xl text-slate-700 font-semibold transition-colors flex items-center justify-between group"
                >
                  {item.label}
                  <ChevronRight className="w-5 h-5 text-emerald-500" />
                </button>
              ))}
            </nav>
            
            <div className="h-px bg-slate-100 my-1" />
            
            <div className="grid grid-cols-1 gap-3">
              <Button onClick={onLoginClick} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-lg font-bold shadow-emerald">
                Começar Grátis
              </Button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;