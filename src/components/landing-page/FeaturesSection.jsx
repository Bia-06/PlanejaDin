import React from "react";
import { Wallet, BarChart3, Bell, Calendar } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Controle de receitas e despesas",
    description: "Registre seus ganhos e gastos em segundos. Veja o saldo atualizado em tempo real.",
    benefit: "Saiba exatamente quanto pode gastar",
    image: "/transaction-print.png", 
    placeholder: "Print: Tela de registro",
  },
  {
    icon: BarChart3,
    title: "Relatórios claros e visuais",
    description: "Gráficos simples que mostram para onde seu dinheiro está indo. Sem planilhas confusas.",
    benefit: "Entenda suas finanças em segundos",
    image: "/reports-print.png",
    placeholder: "Print: Relatório mensal",
  },
  {
    icon: Bell,
    title: "Lembretes inteligentes",
    description: "Adicione e edite lembretes direto no site. Organize seus prazos facilmente.",
    benefit: "Nunca mais esqueça uma conta ou um compromisso",
    image: "/reminder-print.png",
    placeholder: "Print: Lista de lembretes",
  },
  {
    icon: Calendar,
    title: "Calendário completo",
    description: "Visualize tudo em um só lugar: receitas, despesas, seus lembretes e até feriados nacionais.",
    benefit: "Planejamento visual do seu mês",
    image: "/calendar-print.png",
    placeholder: "Print: Calendário mensal",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            Funções
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Tudo que você precisa para{" "}
            <span className="text-emerald-600">
              gerenciar seu dinheiro
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Funcionalidades pensadas para simplificar sua vida financeira, não complicar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full aspect-video bg-slate-100 border-b border-slate-200 overflow-hidden">
                {feature.image ? (
                  <img 
                    src={feature.image} 
                    alt={`Interface da funcionalidade: ${feature.title}`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-emerald-50 group-hover:to-teal-50 transition-colors duration-300">
                    <div className="text-center opacity-50 p-4">
                      <feature.icon className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                      <p className="text-slate-500 text-sm font-medium">{feature.placeholder}</p>
                      <p className="text-xs text-slate-400 mt-1">1919 x 907px</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 mb-3 leading-relaxed">
                      {feature.description}
                    </p>
                    <p className="inline-flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {feature.benefit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;