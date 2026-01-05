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
      
      <Header onLoginClick={onLoginClick} />

      <main className="flex-grow">
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