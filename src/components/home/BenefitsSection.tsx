
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-16 bg-roadside-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-6">Why Choose RoadReady Nigeria?</h2>
            <p className="text-xl text-roadside-100 mb-8 max-w-lg">
              We make finding roadside assistance simple, fast, and stress-free, even when you're in an unfamiliar location in Nigeria.
            </p>

            <div className="space-y-4">
              {[
                "Vetted, professional Nigerian mechanics",
                "Average response time under 20 minutes",
                "Service available 24/7, 365 days a year",
                "Transparent, upfront pricing in Naira",
                "Real-time mechanic tracking across Nigeria"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <Check className="text-accent-400 mr-2" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 pl-0 md:pl-12">
            <div className="bg-white rounded-lg shadow-xl p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-4 text-roadside-800">Join RoadReady Nigeria Today</h3>
              <p className="text-gray-600 mb-6">
                Create a free account to get roadside assistance when you need it most across Nigeria.
              </p>
              <div className="space-y-4">
                <Link to="/user-signup" className="w-full block">
                  <Button size="lg" className="w-full bg-roadside-600 hover:bg-roadside-700">
                    Sign Up as a Driver
                  </Button>
                </Link>
                <Link to="/mechanic-signup" className="w-full block">
                  <Button size="lg" variant="outline" className="w-full border-roadside-600 text-roadside-600 hover:bg-roadside-50">
                    Register as a Mechanic
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 text-center pt-2">
                  Already have an account? <Link to="/login" className="text-roadside-600 hover:underline">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
