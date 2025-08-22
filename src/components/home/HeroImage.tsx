
import React, { useState } from 'react';

const HeroImage: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-full md:w-1/2 relative">
      {!imageError && (
        <div className="p-4 bg-white rounded-lg shadow-xl transform md:rotate-3 md:translate-x-4 relative z-20">
          <img
            src="https://images.unsplash.com/photo-1599256662039-c5d4f637e01c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
            alt="Mechanic helping a stranded driver"
            className="rounded shadow-inner"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <div className={`absolute ${imageError ? 'static mt-4' : '-bottom-6 -left-6'} p-4 bg-roadside-600 rounded-lg shadow-lg z-10 max-w-xs`}>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <span className="text-roadside-600 text-2xl font-bold">5</span>
          </div>
          <div className="text-white">
            <p className="font-bold">Mechanics nearby</p>
            <p className="text-sm text-roadside-100">Average response time: 15 mins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
