import React from "react";
import { UserPlus, PlusCircle, BarChart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crie sua conta grátis",
    description: "Cadastro simples em menos de 2 minuto. Sem burocracia, sem cartão de crédito.",
    image: "/register.png", 
    placeholder: "Print: Tela de cadastro",
  },
  {
    number: "02",
    icon: PlusCircle,
    title: "Registre ganhos e gastos",
    description: "Adicione suas transações de forma rápida e intuitiva. Pode categorizar se quiser.",
    image: "/addtransaction.png",
    placeholder: "Print: Tela de adicionar transação",
  },
  {
    number: "03",
    icon: BarChart,
    title: "Acompanhe seus relatórios",
    description: "Veja gráficos claros, entenda seus padrões de gastos e tome melhores decisões.",
    image: "/reports.png",
    placeholder: "Print: Dashboard",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            Como usar
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Comece a gerenciar seu dinheiro em{" "}
            <span className="text-emerald-600">
              3 passos simples
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Sem complicação. Sem curva de aprendizado. Só resultados.
          </p>
        </div>

        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-[calc(50%+60px)] w-[calc(100%-120px)] h-0.5 bg-slate-200 z-0" />
              )}
              
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative z-10">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg z-20">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>

                  {step.image ? (
                    <img 
                      src={step.image} 
                      alt={`Passo ${step.number}: ${step.title}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
                      <div className="text-center opacity-60">
                        <step.icon className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                        <p className="text-slate-500 text-sm">{step.placeholder}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8 text-center lg:text-left">
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;