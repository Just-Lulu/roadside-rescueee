
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How RoadReady Nigeria Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Get back on Nigerian roads in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-roadside-100 flex items-center justify-center mb-4">
              <span className="text-roadside-600 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Location</h3>
            <p className="text-gray-600">
              Use our app to share your location in Nigeria and describe your vehicle issue.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-roadside-100 flex items-center justify-center mb-4">
              <span className="text-roadside-600 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
            <p className="text-gray-600">
              We'll connect you with nearby Nigerian mechanics who can help with your specific issue.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-roadside-100 flex items-center justify-center mb-4">
              <span className="text-roadside-600 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Back on the Road</h3>
            <p className="text-gray-600">
              The mechanic arrives to fix your issue or tow your vehicle if needed.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/find-mechanic">
            <Button size="lg" className="bg-roadside-600 hover:bg-roadside-700">
              Find a Mechanic Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
