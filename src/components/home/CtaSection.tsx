
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-accent-500 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of Nigerian drivers who rely on RoadReady for quick roadside assistance.
        </p>
        <Link to="/user-signup">
          <Button size="lg" className="bg-white text-accent-700 hover:bg-white/90">
            Sign Up Now — It's Free
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
