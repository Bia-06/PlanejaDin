import React from "react";
import { Button } from "@/components/shadcn/button";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react"; 

const CTASection = ({ onLoginClick }) => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-slate-50 rounded-3xl p-8 md:p-16 border border-slate-100 shadow-xl shadow-slate-200/50">
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
            Pronto para ter clareza sobre suas finanças?
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Junte-se a nós e transforme sua relação com o dinheiro.
            Comece grátis hoje mesmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              size="lg" 
              onClick={onLoginClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg h-14 px-8 rounded-full shadow-emerald hover:shadow-lg transition-all"
            >
              Começar grátis agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={(e) => e.preventDefault()} 
              className="border-slate-300 text-slate-700 text-lg h-14 px-8 rounded-full 
                         hover:bg-transparent hover:text-slate-400 hover:border-slate-200 hover:cursor-not-allowed transition-colors"
              title="Demonstração indisponível no momento"
            >
              Ver demonstração
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Grátis para começar
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Cancele quando quiser
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;