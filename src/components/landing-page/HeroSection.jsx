import React from "react";
import { Button } from "@/components/shadcn/button";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

const HeroSection = ({ onLoginClick }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Versão 1.0.33 (BETA)
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight mb-6 animate-fade-up">
              A forma inteligente de cuidar<br />
              <span className="text-emerald-600">
                do seu dinheiro
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Chega de planilhas confusas. Com o GerenciaDin, você entende para onde seu dinheiro vai e toma decisões financeiras com clareza total.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Button 
                size="xl" 
                onClick={onLoginClick}
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-8 text-lg shadow-emerald hover:shadow-lg transition-all"
              >
                Começar grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
    
              <Button 
                variant="outline" 
                size="xl" 
                onClick={(e) => e.preventDefault()} 
                className="rounded-full border-slate-200 bg-white text-slate-700 h-14 px-8 text-lg 
                           hover:bg-white hover:text-slate-400 hover:cursor-not-allowed transition-colors"
                title="Demonstração indisponível no momento"
              >
                <Play className="mr-2 w-5 h-5 fill-emerald-600 text-emerald-600 group-hover:text-slate-400 group-hover:fill-slate-400" />
                Ver demonstração
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Configuração em 2 minutos
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.4s" }}>

            <div className="relative z-10 bg-slate-900 rounded-2xl p-2 shadow-2xl ring-1 ring-slate-200/20">
              <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4 bg-slate-800/50 rounded-md px-3 py-1 text-[10px] text-slate-400 text-center border border-slate-600/50">
                    gerenciadin.com.br
                  </div>
                </div>

                <div className="aspect-[1919/906] bg-slate-900 flex items-center justify-center relative overflow-hidden group">
                   <img 
                     src="/hero-desktop.png" 
                     alt="Dashboard Desktop" 
                     className="w-full h-full object-cover object-top"
                   /> 
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 md:-right-12 w-32 md:w-48 z-20 animate-float drop-shadow-2xl">
              <div className="bg-slate-900 rounded-[3rem] p-2 shadow-2xl ring-1 ring-slate-800">
                <div className="bg-black rounded-[2.5rem] overflow-hidden relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-30 flex items-center justify-center ring-1 ring-white/10">
                     <div className="w-1 h-1 rounded-full bg-slate-800 ml-auto mr-2" />
                  </div>
                  <div className="aspect-[778/1686] bg-black relative overflow-hidden">
                     <img 
                       src="/hero-mobile.png" 
                       alt="App Mobile" 
                       className="w-full h-full object-cover" 
                     /> 
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;