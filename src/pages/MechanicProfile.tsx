import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard, { ServiceType } from '@/components/ServiceCard';
import Map from '@/components/Map';
import InAppMessaging from '@/components/InAppMessaging';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, MessageCircle, Clock, MapPin, Star } from 'lucide-react';

// Mock data for the mechanic profile with Nigerian/Black profile images
const mockMechanicProfile = {
  id: '1',
  name: 'Quick Fix Auto',
  ownerName: 'Michael Okonkwo',
  rating: 4.8,
  reviewCount: 124,
  distance: '1.2',
  estimatedArrival: '12',
  phone: '(+234) 123-4567',
  email: 'service@quickfixauto.com',
  address: '123 Herbert Macaulay Way, Yaba, Lagos',
  bio: 'With over 15 years of experience, Quick Fix Auto specializes in emergency roadside assistance in Lagos and surrounding areas. We pride ourselves on fast response times and quality service at fair prices.',
  services: {
    towing: true,
    jumpStart: true,
    tireFix: true,
    fuelDelivery: true,
    lockoutService: false,
    basicRepair: true
  },
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  gallery: [
    'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop'
  ],
  reviews: [
    {
      id: '1',
      user: 'Chinwe A.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Michael arrived within 15 minutes after I called for help with my flat tire on Third Mainland Bridge. Very professional and friendly service!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b524?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: '2',
      user: 'Emeka L.',
      rating: 4,
      date: '1 month ago',
      comment: 'Quick response time and reasonable pricing. Helped me jump start my car when the battery died in Victoria Island.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: '3',
      user: 'Ngozi M.',
      rating: 5,
      date: '2 months ago',
      comment: 'I was stranded on the highway with a dead battery, and Quick Fix came to my rescue. Excellent service!',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face'
    }
  ]
};

const MechanicProfile = () => {
  const { id } = useParams<{id: string}>();
  const [mechanic, setMechanic] = useState(mockMechanicProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, we would fetch the mechanic data based on the ID
      console.log(`Fetching mechanic with ID: ${id}`);
      setMechanic(mockMechanicProfile);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse-slow">Loading mechanic profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link to="/find-mechanic" className="text-roadside-600 hover:text-roadside-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Search Results
            </Link>
          </div>
          
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 flex justify-center md:justify-start mb-4 md:mb-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-roadside-100">
                  <img 
                    src={mechanic.image} 
                    alt={mechanic.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-3/4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{mechanic.name}</h1>
                    <p className="text-gray-600">Owner: {mechanic.ownerName}</p>
                    
                    <div className="flex items-center mt-2 mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="fill-yellow-500 h-5 w-5" />
                        <span className="ml-1 font-semibold">{mechanic.rating}</span>
                      </div>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-600">{mechanic.reviewCount} reviews</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-600 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {mechanic.distance} miles away
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Badge className="bg-accent-500 mb-2">
                      <Clock className="mr-1 h-4 w-4" /> 
                      Can arrive in {mechanic.estimatedArrival} minutes
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{mechanic.bio}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Link to={`/request-help/${mechanic.id}`}>
                    <Button className="bg-accent-500 hover:bg-accent-600">
                      Request Assistance
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-roadside-600 text-roadside-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {mechanic.phone}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-roadside-600 text-roadside-600"
                    onClick={() => setIsMessagingOpen(true)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                  <ServiceCard services={mechanic.services as Record<ServiceType, boolean>} />
                </CardContent>
              </Card>
              
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Photo Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mechanic.gallery.map((image, index) => (
                      <div key={index} className="aspect-video rounded-md overflow-hidden bg-gray-200">
                        <img 
                          src={image} 
                          alt={`${mechanic.name} gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=500&h=300&fit=crop&sig=${index}`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Reviews</h2>
                    <div className="flex items-center">
                      <Star className="fill-yellow-500 h-5 w-5" />
                      <span className="ml-1 font-semibold">{mechanic.rating}</span>
                      <span className="text-gray-600 ml-1">({mechanic.reviewCount})</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {mechanic.reviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-start">
                          <img 
                            src={review.avatar} 
                            alt={review.user} 
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-semibold">{review.user}</span>
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                            <div className="flex items-center text-yellow-500 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-500' : 'fill-gray-200'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 mt-2">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-4">
                    <Button variant="ghost" className="text-roadside-600">
                      See All Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column */}
            <div>
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">Location</h2>
                  <p className="text-gray-700 mb-4">{mechanic.address}</p>
                  
                  <div className="h-56 mb-4">
                    <Map className="h-full w-full" />
                  </div>
                  
                  <Button className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-semibold">24 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-semibold">24 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-semibold">24 Hours</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <Badge className="bg-green-500">Currently Open</Badge>
                    <p className="text-sm text-gray-500 mt-2">
                      Emergency service available 24/7
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <InAppMessaging
        mechanicName={mechanic.ownerName}
        mechanicImage={mechanic.image}
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
      />
      
      <Footer />
    </div>
  );
};

export default MechanicProfile;
