
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-roadside-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-roadside-600 font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold">RoadReady</span>
            </div>
            <p className="text-roadside-100 text-sm">
              Connecting stranded drivers with nearby mechanics for quick roadside assistance.
            </p>
          </div>
          
          {/* For Drivers */}
          <div>
            <h3 className="font-bold mb-4 text-lg">For Drivers</h3>
            <ul className="space-y-2">
              <li><Link to="/find-mechanic" className="text-roadside-100 hover:text-white transition-colors">Find a Mechanic</Link></li>
              <li><Link to="/user-signup" className="text-roadside-100 hover:text-white transition-colors">Create an Account</Link></li>
              <li><Link to="/" className="text-roadside-100 hover:text-white transition-colors">Emergency Services</Link></li>
            </ul>
          </div>
          
          {/* For Mechanics */}
          <div>
            <h3 className="font-bold mb-4 text-lg">For Mechanics</h3>
            <ul className="space-y-2">
              <li><Link to="/mechanic-signup" className="text-roadside-100 hover:text-white transition-colors">Join as a Mechanic</Link></li>
              <li><Link to="/" className="text-roadside-100 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/" className="text-roadside-100 hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-roadside-800 text-roadside-100 flex flex-col md:flex-row justify-between">
          <div>
            &copy; {new Date().getFullYear()} RoadReady. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
