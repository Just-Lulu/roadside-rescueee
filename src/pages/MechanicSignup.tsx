import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';


const MechanicSignup = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessAddress: '',
    serviceArea: '',
    bio: '',
  });
  
  const [services, setServices] = useState({
    towing: false,
    jumpStart: false,
    tireFix: false,
    fuelDelivery: false,
    lockoutService: false,
    basicRepair: false,
  });
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleServiceChange = (service: keyof typeof services) => {
    setServices(prevServices => ({
      ...prevServices,
      [service]: !prevServices[service]
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        user_type: 'mechanic',
        business_name: formData.businessName,
        phone: formData.phone,
      });

      if (error) {
        toast.error(error.message || 'Failed to register. Please try again.');
      } else {
        toast.success('Registration successful! Please confirm your email, then log in to complete your profile.');
        // Clear form
        setFormData({
          businessName: '',
          ownerName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          businessAddress: '',
          serviceArea: '',
          bio: '',
        });
        setServices({
          towing: false,
          jumpStart: false,
          tireFix: false,
          fuelDelivery: false,
          lockoutService: false,
          basicRepair: false,
        });
        setAcceptTerms(false);
        navigate('/login');
      }
    } catch (err) {
      console.error('Mechanic signup error:', err);
      toast.error('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Register as a Mechanic</CardTitle>
              <CardDescription>
                Join our network of roadside assistance providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Business Information</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    name="businessName" 
                    placeholder="Quick Fix Auto Service" 
                    value={formData.businessName}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner/Manager Name</Label>
                    <Input 
                      id="ownerName" 
                      name="ownerName" 
                      placeholder="John Smith" 
                      value={formData.ownerName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="(123) 456-7890" 
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="service@quickfixauto.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Input 
                      id="businessAddress" 
                      name="businessAddress" 
                      placeholder="123 Main St, Anytown, ST 12345" 
                      value={formData.businessAddress}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Area (miles from your location)</Label>
                  <Input 
                    id="serviceArea" 
                    name="serviceArea" 
                    type="number" 
                    placeholder="25" 
                    min="1"
                    max="100"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    required 
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This defines how far you're willing to travel to provide service
                  </p>
                </div>

                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Services Offered</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Select all services that you can provide
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="towing" 
                      checked={services.towing}
                      onCheckedChange={() => handleServiceChange('towing')}
                    />
                    <label
                      htmlFor="towing"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Towing Service
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="jumpStart" 
                      checked={services.jumpStart}
                      onCheckedChange={() => handleServiceChange('jumpStart')}
                    />
                    <label
                      htmlFor="jumpStart"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Jump Start
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tireFix" 
                      checked={services.tireFix}
                      onCheckedChange={() => handleServiceChange('tireFix')}
                    />
                    <label
                      htmlFor="tireFix"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Flat Tire Fix/Change
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fuelDelivery" 
                      checked={services.fuelDelivery}
                      onCheckedChange={() => handleServiceChange('fuelDelivery')}
                    />
                    <label
                      htmlFor="fuelDelivery"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fuel Delivery
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lockoutService" 
                      checked={services.lockoutService}
                      onCheckedChange={() => handleServiceChange('lockoutService')}
                    />
                    <label
                      htmlFor="lockoutService"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Lockout Service
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="basicRepair" 
                      checked={services.basicRepair}
                      onCheckedChange={() => handleServiceChange('basicRepair')}
                    />
                    <label
                      htmlFor="basicRepair"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Basic Repairs
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Business Description</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    placeholder="Tell drivers about your experience and what makes your service special..." 
                    value={formData.bio}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>

                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Account Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-roadside-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-roadside-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-roadside-600 hover:bg-roadside-700" 
                  disabled={!acceptTerms || isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Register as Mechanic'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-center text-sm text-gray-600">
                Already registered?{' '}
                <Link to="/login" className="text-roadside-600 hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MechanicSignup;
