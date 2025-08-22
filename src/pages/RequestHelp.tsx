
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MessageCircle, Phone } from 'lucide-react';
import { useServiceRequests, ServiceRequest } from '@/hooks/useServiceRequests';
import { useAuth } from '@/hooks/useAuth';

const RequestHelp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRequest } = useServiceRequests();
  const [issueType, setIssueType] = useState<ServiceRequest['issue_type']>('flat-tire');
  const [description, setDescription] = useState('');
  const [contactMethod, setContactMethod] = useState<ServiceRequest['contact_method']>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!description.trim()) {
      return;
    }
    
    if (contactMethod === 'phone' && !phoneNumber.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData = {
        mechanic_id: id,
        issue_type: issueType,
        description,
        contact_method: contactMethod,
        phone_number: contactMethod === 'phone' ? phoneNumber : undefined,
      };
      
      const result = await createRequest(requestData);
      
      if (result) {
        // Redirect to dashboard after successful submission
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Roadside Help</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mechanic #{id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Please fill out this form to request help from this mechanic. They will contact you as soon as possible.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Service Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="issue-type" className="block text-sm font-medium text-gray-700">
                    What's the issue? *
                  </label>
                  <Select value={issueType} onValueChange={(value) => setIssueType(value as ServiceRequest['issue_type'])}>
                    <SelectTrigger id="issue-type">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat-tire">Flat Tire</SelectItem>
                      <SelectItem value="dead-battery">Dead Battery</SelectItem>
                      <SelectItem value="engine-trouble">Engine Trouble</SelectItem>
                      <SelectItem value="out-of-fuel">Out of Fuel</SelectItem>
                      <SelectItem value="locked-out">Locked Out</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Detailed Description *
                  </label>
                  <Textarea 
                    id="description" 
                    placeholder="Please describe your issue in detail, including your current location..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Contact Method *
                  </label>
                  <Tabs value={contactMethod} onValueChange={(value) => setContactMethod(value as ServiceRequest['contact_method'])} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="phone" className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone Call
                      </TabsTrigger>
                      <TabsTrigger value="message" className="flex items-center">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        In-app Message
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {contactMethod === 'phone' && (
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Your Phone Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 xxx xxx xxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required={contactMethod === 'phone'}
                    />
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-roadside-600 hover:bg-roadside-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Mechanics typically respond within 5-10 minutes</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RequestHelp;
