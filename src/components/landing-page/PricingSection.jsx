import React from "react";
import { Button } from "@/components/shadcn/button";
import { Check, ArrowRight, Sparkles, Star, Calendar, ShieldCheck, Loader2 } from "lucide-react"; 
import { cn } from "@/lib/utils";
import ScrollReveal from "../UI/ScrollReveal"; 
import { useSubscription } from "../../hooks/useSubscription"; 

const STRIPE_IDS = {
    MENSAL: 'price_1SqJt2KqdupDv88N85NkvsUg', 
    ANUAL: 'price_1SqJvdKqdupDv88NbZVENBUo'  
};

const pricingData = [
  {
    id: "freemium",
    badge: null,
    headline: "Iniciante",
    subheadline: "Perfeito para quem está começando a se organizar.",
    price: "0",
    period: "/sempre",
    cta: "Começar Grátis",
    ctaVariant: "outline",
    features: [
      "10 Movimentações (Depesa e Receita)",
      "3 Formas de Pagamento",
      "3 Categorias Personalizadas",
      "3 Lembretes por Mês",
      "Acesso ao Calendário (Visualização)"
    ],
    highlight: "Uso gratuito vitalício.",
  },
  {
    id: "mensal",
    badge: "30 Dias Grátis",
    isPopular: true,
    headline: "Pro Mensal",
    subheadline: "Flexibilidade total para o seu dia a dia.",
    price: "22,90",
    period: "/mês",
    promoDetail: "Nos 2 primeiros meses pagos*",
    cta: "Começar Teste Grátis", 
    ctaVariant: "default",
    features: [
      "Categorias e Subcategorias ilimitadas",
      "Lembretes ilimitados",
      "Gráficos e Relatórios de Evolução",
      "Gestão de Formas de Pagamento",
      "Calendário e Agenda Completa"
    ],
    highlight: "Cancele quando quiser.",
  },
  {
    id: "anual",
    isLocked: false, 
    badge: "Economia Inteligente",
    headline: "Pro Anual",
    subheadline: "Para quem já decidiu mudar de vida.",
    price: "279,90",
    period: "/ano",
    promoDetail: "Equivalente a R$ 23,32/mês",
    cta: "Garantir Desconto",
    ctaVariant: "default",
    features: [
      "Todos os benefícios do Pro",
      "2 Meses Grátis (vs valor padrão)",
      "Proteção contra aumento de preço",
      "Suporte Prioritário",
      "Zero dor de cabeça"
    ],
    highlight: "Pagamento único anual.",
  },
];

const PricingSection = ({ onLoginClick }) => {
  const { handleCheckout, checkoutLoading } = useSubscription();

  const handlePlanClick = async (planId) => {
    if (planId === 'freemium') {
        onLoginClick();
        return;
    }

    let priceId = '';
    let isMonthly = false;

    if (planId === 'mensal') {
        priceId = STRIPE_IDS.MENSAL;
        isMonthly = true;
    } else if (planId === 'anual') {
        priceId = STRIPE_IDS.ANUAL;
        isMonthly = false;
    }

    const isLoggedIn = await handleCheckout(priceId, isMonthly);
    if (!isLoggedIn) {
        onLoginClick();
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        
        <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold mb-4 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Lançamento
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Comece a organizar hoje, <br/> <span className="text-emerald-600">pague só mês que vem.</span>
            </h2>
            <p className="text-lg text-slate-600">
                Aproveite <strong>30 dias grátis</strong> no plano Pro. <br/>
                Sem pegadinhas, sem compromisso.
            </p>
            </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {pricingData.map((plan, index) => {
            
            return (
              <ScrollReveal key={plan.id} delay={index * 150} className="h-full">
                  <div
                    className={cn(
                      "relative flex flex-col p-8 rounded-3xl transition-all duration-300 h-full",
                      plan.isPopular
                        ? "bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-900/10 md:-mt-8 md:mb-0 z-10 scale-100 md:scale-105"
                        : "bg-white border border-slate-200 hover:shadow-xl hover:border-emerald-200"
                    )}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ring-4 ring-white",
                            plan.isPopular
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-100 text-emerald-800"
                          )}
                        >
                          {plan.isPopular && <Star className="w-3.5 h-3.5 fill-current" />}
                          {plan.id === "anual" && <ShieldCheck className="w-3.5 h-3.5" />}
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6 pt-4">
                      <h3 className="font-display text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                        {plan.headline}
                      </h3>
                      <p className="text-slate-500 text-sm min-h-[40px] px-2 leading-relaxed">
                        {plan.subheadline}
                      </p>
                    </div>

                    <div className="text-center mb-8 bg-slate-50 rounded-2xl py-6 mx-2 border border-slate-100">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-lg font-medium text-slate-400">R$</span>
                        <span className={cn(
                            "font-display text-5xl font-bold tracking-tight",
                            plan.isPopular ? "text-emerald-600" : "text-slate-900"
                        )}>
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-slate-400 font-medium">{plan.period}</span>
                        )}
                      </div>
                      
                      <div className="mt-2 min-h-[24px]">
                        {plan.promoDetail && (
                          <p className={cn(
                              "text-xs font-bold uppercase tracking-wide",
                              plan.isPopular ? "text-emerald-700 bg-emerald-100 inline-block px-2 py-1 rounded" : "text-slate-500"
                          )}>
                            {plan.promoDetail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 px-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        O que está incluso:
                      </div>
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-3">
                                <div className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                    plan.isPopular || plan.id === 'anual' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                                )}>
                                  <Check className="w-3 h-3" strokeWidth={3} />
                                </div>
                                <span className="text-sm leading-tight font-medium text-slate-700">
                                  {feature}
                                </span>
                           </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      size="lg" 
                      onClick={() => handlePlanClick(plan.id)}
                      disabled={checkoutLoading}
                      variant={plan.ctaVariant === "outline" ? "outline" : "default"}
                      className={cn(
                        "w-full mb-6 h-12 text-base font-bold rounded-xl transition-all duration-300",
                        plan.isPopular
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 animate-pulse-slow"
                          : "text-slate-600 border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                      )}
                    >
                      {checkoutLoading && plan.id !== 'freemium' ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
                      ) : (
                          <>{plan.cta} <ArrowRight className="ml-2 w-4 h-4" /></>
                      )}
                    </Button>

                    <div
                      className={cn(
                        "mt-auto pt-4 border-t text-center text-xs font-medium",
                        plan.isPopular
                          ? "border-emerald-100 text-emerald-700"
                          : "border-slate-100 text-slate-400"
                      )}
                    >
                      {plan.highlight}
                    </div>
                  </div>
              </ScrollReveal>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
              <div className="inline-block bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm max-w-2xl mx-auto">
                <div className="flex items-start gap-3 text-left">
                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 shrink-0">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Entenda a Oferta de Lançamento (Plano Mensal):</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            <strong>1.</strong> Você usa o 1º mês 100% grátis.<br/>
                            <strong>2.</strong> Se gostar, paga o valor promocional de <strong>R$ 22,90</strong> no 2º e 3º mês.<br/>
                            <strong>3.</strong> A partir do 4º mês, o valor ajusta para o preço padrão de <strong>R$ 27,90</strong>.<br/>
                            <span className="text-xs text-slate-400 mt-1 block">* O Plano Anual já considera o desconto sobre o valor padrão de R$ 27,90.</span>
                        </p>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;