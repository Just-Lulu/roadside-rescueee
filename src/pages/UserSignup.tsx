
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return;
    }
    
    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_type: 'driver'
    });
    
    if (!error) {
      // User will be redirected after email confirmation
    }
    
    setIsLoading(false);
  };
  
  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Google') {
      setIsLoading(true);
      await signInWithGoogle();
      setIsLoading(false);
    }
  };

  // Sample years for vehicle selection
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Create a Driver Account</CardTitle>
              <CardDescription>
                Sign up to find roadside assistance when you need it most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Grid */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        placeholder="John" 
                        value={formData.firstName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        placeholder="Doe" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        placeholder="+234 801 234 5678" 
                        value={formData.phone}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Security Information Grid */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Security Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
                <Separator />
                
                {/* Vehicle Information Grid */}
                <div>
                  <h3 className="text-lg font-medium">Vehicle Information (Optional)</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    Adding your vehicle details helps mechanics provide more accurate assistance
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Vehicle Make</Label>
                      <Input 
                        id="vehicleMake" 
                        name="vehicleMake" 
                        placeholder="Toyota" 
                        value={formData.vehicleMake}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Vehicle Model</Label>
                      <Input 
                        id="vehicleModel" 
                        name="vehicleModel" 
                        placeholder="Camry" 
                        value={formData.vehicleModel}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleYear">Vehicle Year</Label>
                      <Select>
                        <SelectTrigger id="vehicleYear">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-4">
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
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 transition"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 transition"
                  onClick={() => handleSocialLogin('Apple')}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.18,4.18,0,0,0,12,6.61,3.66,3.66,0,0,0,14.94,5.19Z"/>
                    <path d="M16.83,6.39A4.63,4.63,0,0,0,14,10.09a4.28,4.28,0,0,0,2.11-.55A5.13,5.13,0,0,0,18.53,6,4.39,4.39,0,0,0,16.83,6.39Z"/>
                    <path d="M21.41,16c-.35-1,1-3.43.5-5.38s-2.47-3.09-3.68-3.7C16.89,6.2,15.06,7,13.4,7S9.92,6.2,8.58,6.92C7.37,7.53,6.3,9.05,5.79,11s.9,4.43.55,5.38C5.6,18,4,22,6,22c1.73,0,3-1.95,5.07-2s3.32,2,5.05,2C18,22,16.44,18,21.41,16Z"/>
                  </svg>
                  Apple
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
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

export default UserSignup;
