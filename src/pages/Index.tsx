
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ServicesSection from '@/components/home/ServicesSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import CtaSection from '@/components/home/CtaSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
