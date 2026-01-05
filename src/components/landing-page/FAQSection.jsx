import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";

const faqs = [
  {
    question: "O GerenciaDin é realmente gratuito para começar?",
    answer: "Sim! Você pode criar sua conta gratuitamente e usar a versão básica sem pagar nada. Não pedimos cartão de crédito para o cadastro.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer: "Absolutamente! Não há contratos ou multas. Você pode cancelar sua assinatura quando quiser.",
  },
  {
    question: "Meus dados financeiros estão seguros?",
    answer: "Sua segurança é nossa prioridade. Usamos criptografia de ponta a ponta para proteger seus dados. Não vendemos suas informações.",
  },
  {
    question: "Funciona no celular e no computador?",
    answer: "Sim! O GerenciaDin funciona em qualquer dispositivo com navegador. Você pode acessar pelo celular, tablet ou computador e em breve app!",
  },
  {
    question: "Preciso ter conhecimento em finanças para usar?",
    answer: "Não! O GerenciaDin foi feito para pessoas que querem simplicidade e eliminar planilhas. Não usamos termos técnicos complicados.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Perguntas frequentes
          </h2>
          <p className="text-lg text-slate-600">
            Tire suas dúvidas sobre o GerenciaDin.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm data-[state=open]:border-emerald-200 data-[state=open]:ring-1 data-[state=open]:ring-emerald-100 transition-all duration-200"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-emerald-700 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600">
            Ainda tem dúvidas?{" "}
            <a href="https://portfolio--beatriz.vercel.app/#contact" className="text-emerald-600 font-medium hover:underline">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;