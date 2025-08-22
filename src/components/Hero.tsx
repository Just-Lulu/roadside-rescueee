
import React from 'react';
import HeroPattern from './home/HeroPattern';
import HeroText from './home/HeroText';
import HeroImage from './home/HeroImage';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-roadside-900 overflow-hidden">
      <HeroPattern />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <HeroText />
          <HeroImage />
        </div>
      </div>
    </div>
  );
};

export default Hero;
