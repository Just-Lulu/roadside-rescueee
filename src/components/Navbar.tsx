
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-roadside-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold text-roadside-900">RoadReady</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-roadside-600 transition-colors">Home</Link>
          <Link to="/find-mechanic" className="text-gray-700 hover:text-roadside-600 transition-colors">Find Mechanic</Link>
          <Link to="/charts" className="text-gray-700 hover:text-roadside-600 transition-colors">System Charts</Link>
          
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-roadside-600 transition-colors flex items-center space-x-1">
                <User size={16} />
                <span>Dashboard</span>
              </Link>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="border-roadside-600 text-roadside-600 hover:bg-roadside-50"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-roadside-600 transition-colors">Login</Link>
              <Link to="/user-signup">
                <Button className="bg-roadside-600 hover:bg-roadside-700">Sign Up</Button>
              </Link>
              <Link to="/mechanic-signup">
                <Button variant="outline" className="border-roadside-600 text-roadside-600 hover:bg-roadside-50">
                  Register as Mechanic
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 shadow-md">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-roadside-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/find-mechanic" 
              className="text-gray-700 hover:text-roadside-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Find Mechanic
            </Link>
            <Link 
              to="/charts" 
              className="text-gray-700 hover:text-roadside-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              System Charts
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-roadside-600 transition-colors py-2 flex items-center space-x-1"
                  onClick={toggleMenu}
                >
                  <User size={16} />
                  <span>Dashboard</span>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  className="w-full border-roadside-600 text-roadside-600 hover:bg-roadside-50"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-roadside-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link to="/user-signup" onClick={toggleMenu}>
                  <Button className="w-full bg-roadside-600 hover:bg-roadside-700">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/mechanic-signup" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full border-roadside-600 text-roadside-600 hover:bg-roadside-50">
                    Register as Mechanic
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
