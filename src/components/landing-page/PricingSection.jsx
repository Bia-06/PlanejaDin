import React from "react";
import { Button } from "@/components/shadcn/button";
import { Check, ArrowRight, Sparkles, Lock } from "lucide-react"; 
import { cn } from "@/lib/utils";
import ScrollReveal from "../UI/ScrollReveal"; 

const pricingData = [
  {
    id: "freemium",
    badge: null,
    headline: "Grátis",
    subheadline: "Teste a versão beta agora mesmo e nos dê feedback.",
    price: "0",
    period: "/sempre",
    priceMonthly: null,
    cta: "Criar conta",
    ctaVariant: "outline",
    features: [
      "Tudo incluso para testes",
    ],
    highlight: "Sem compromisso.",
  },
  {
    id: "mensal",
    badge: "Flexibilidade",
    headline: "Mensal",
    subheadline: "Controle total por menos de um café.",
    price: "19,90",
    period: "/mês",
    priceMonthly: null,
    cta: "Em breve", 
    ctaVariant: "default",
    features: [
      "Em breve",
    ],
    highlight: "Cancele quando quiser.",
  },
  {
    id: "anual",
    isPopular: true,
    badge: "Economize 40%",
    headline: "Anual",
    subheadline: "O favorito de quem planeja o futuro.",
    price: "149,90",
    period: "/ano",
    priceMonthly: "Equivalente a R$ 12,49/mês",
    cta: "Em breve",
    ctaVariant: "default",
    features: [
      "Em breve",
    ],
    highlight: "Pague 1x, use o ano todo.",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        
        <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
                Planos
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Escolha o plano ideal
            </h2>
            <p className="text-lg text-slate-600">
                Durante o período Beta, use o plano gratuito à vontade.
            </p>
            </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {pricingData.map((plan, index) => {
            const isPaidPlan = plan.id !== "freemium";

            return (
              <ScrollReveal key={plan.id} delay={index * 150} className="h-full">
                  <div
                    className={cn(
                      "relative flex flex-col p-8 rounded-3xl transition-all duration-300 h-full",
                      plan.isPopular
                        ? "bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-900/10 md:-mt-8 md:mb-0 z-10"
                        : "bg-slate-50 border border-slate-200 hover:shadow-xl hover:bg-white"
                    )}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm",
                            plan.isPopular
                              ? "bg-emerald-600 text-white"
                              : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {plan.isPopular && <Sparkles className="w-3.5 h-3.5" />}
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8 pt-2">
                      <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                        {plan.headline}
                      </h3>
                      <p className="text-slate-500 text-sm min-h-[40px]">
                        {plan.subheadline}
                      </p>
                    </div>

                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xl font-medium text-slate-400">R$</span>
                        <span className="font-display text-5xl font-bold text-slate-900">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-slate-400 font-medium">{plan.period}</span>
                        )}
                      </div>
                      <div className="h-6 mt-2">
                        {plan.priceMonthly && (
                          <p className="text-emerald-600 text-sm font-bold">
                            {plan.priceMonthly}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      disabled={isPaidPlan} 
                      variant={plan.ctaVariant === "outline" ? "outline" : "default"}
                      className={cn(
                        "w-full mb-8 h-12 text-base font-semibold rounded-xl transition-all duration-300",
                        plan.isPopular
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald hover:shadow-lg"
                          : "text-slate-600 border-slate-300 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50",                    
                        isPaidPlan && "opacity-60 cursor-not-allowed bg-slate-200 text-slate-400 border-slate-200 hover:bg-slate-200 hover:text-slate-400 hover:shadow-none"
                      )}
                    >
                      {plan.cta}
                      {isPaidPlan ? (
                        <Lock className="ml-2 w-4 h-4" />
                      ) : (
                        <ArrowRight className="ml-2 w-4 h-4" />
                      )}
                    </Button>

                    <div className="flex-1">
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span className="text-slate-600 text-sm leading-tight">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className={cn(
                        "mt-auto pt-4 border-t text-center text-xs font-medium",
                        plan.isPopular
                          ? "border-emerald-100 text-emerald-700"
                          : "border-slate-200 text-slate-500"
                      )}
                    >
                      {plan.highlight}
                    </div>
                  </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;