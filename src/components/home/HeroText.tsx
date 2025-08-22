
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroText: React.FC = () => {
  return (
    <div className="w-full md:w-1/2 text-white space-y-6 mb-10 md:mb-0">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Stranded on the Road?
        <span className="block text-accent-400 mt-2">
          Find Help in Minutes
        </span>
      </h1>
      <p className="text-xl text-roadside-100 max-w-lg">
        RoadReady connects you with nearby mechanics who can help you get back on the road quickly, even in unfamiliar locations.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
        <Link to="/find-mechanic">
          <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
            Find a Mechanic Now
          </Button>
        </Link>
        <Link to="/mechanic-signup">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Register as a Mechanic
          </Button>
        </Link>
      </div>
      <div className="pt-4 text-roadside-100">
        <p>
          <span className="font-semibold text-white">24/7 Service</span> • 
          <span className="ml-2">Over 5,000+ Mechanics Nationwide</span>
        </p>
      </div>
    </div>
  );
};

export default HeroText;
