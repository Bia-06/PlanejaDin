import React from 'react';
import Header from './landing-page/Header';
import HeroSection from './landing-page/HeroSection';
import HowItWorksSection from './landing-page/HowItWorksSection';
import FeaturesSection from './landing-page/FeaturesSection';
import PricingSection from './landing-page/PricingSection';
import FAQSection from './landing-page/FAQSection';
import CTASection from './landing-page/CTASection';
import Footer from './landing-page/Footer';
import ScrollReveal from "./UI/ScrollReveal";

const LandingPage = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <style>{`
        @media (min-width: 1280px) {
          /* Aplica apenas dentro do main (conteúdo), ignorando o Header */
          .landing-content-expanded .max-w-4xl,
          .landing-content-expanded .max-w-5xl,
          .landing-content-expanded .max-w-6xl {
            max-width: 80rem !important; /* 1280px */
          }
        }
        @media (min-width: 1536px) {
          /* Expande apenas o conteúdo principal para 1800px */
          .landing-content-expanded .max-w-4xl,
          .landing-content-expanded .max-w-5xl,
          .landing-content-expanded .max-w-6xl,
          .landing-content-expanded .max-w-7xl,
          .landing-content-expanded .container {
            max-width: 1800px !important;
            padding-left: 3.5rem !important;
            padding-right: 3.5rem !important;
          }
        }
      `}</style>

      <Header onLoginClick={onLoginClick} />

      <main className="flex-grow landing-content-expanded">
        <ScrollReveal>
            <HeroSection onLoginClick={onLoginClick} />
        </ScrollReveal>
        
        <ScrollReveal>
            <FeaturesSection />
        </ScrollReveal>
        
        <ScrollReveal>
            <HowItWorksSection />
        </ScrollReveal>
            <PricingSection onLoginClick={onLoginClick} />
        <ScrollReveal>
            <FAQSection />
        </ScrollReveal>

        <ScrollReveal>
            <CTASection onLoginClick={onLoginClick} />
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;