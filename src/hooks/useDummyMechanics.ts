import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface DummyMechanic {
  id: string;
  name: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  distance: string;
  estimatedArrival: string;
  phone: string;
  address: string;
  bio: string;
  latitude: number;
  longitude: number;
  available: boolean;
  responseTime: number; // in minutes
  services: {
    towing: boolean;
    jumpStart: boolean;
    tireFix: boolean;
    fuelDelivery: boolean;
    lockoutService: boolean;
    basicRepair: boolean;
  };
  image: string;
}

// Generate mechanics around a given location (within specified radius)
const generateMechanicsAroundLocation = (centerLat: number, centerLng: number, radiusKm: number = 20): DummyMechanic[] => {
  const mechanicNames = [
    { business: 'Quick Fix Auto Nigeria', owner: 'Michael Okonkwo' },
    { business: 'Highway Heroes Naija', owner: 'Ahmed Bello' },
    { business: 'Reliable Roadside Nigeria', owner: 'Chioma Okoro' },
    { business: 'Express Auto Rescue', owner: 'Ibrahim Yakubu' },
    { business: 'Fast Track Motors', owner: 'Grace Adebayo' },
    { business: 'Road Warriors Nigeria', owner: 'Emeka Nwachukwu' },
    { business: 'Swift Auto Solutions', owner: 'Fatima Aliyu' },
    { business: 'Metro Mechanics', owner: 'Victor Okafor' },
    { business: 'City Car Care', owner: 'Amina Hassan' },
    { business: 'Professional Auto Service', owner: 'Tunde Adewale' },
  ];

  const phoneNumbers = [
    '+234 803 123 4567',
    '+234 805 987 6543',
    '+234 807 456 7890',
    '+234 809 321 6547',
    '+234 810 654 9870',
    '+234 812 789 3456',
    '+234 814 135 7924',
    '+234 816 246 8135',
    '+234 818 357 9246',
    '+234 820 468 0357',
  ];

  const profileImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b524?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=400&fit=crop&crop=face',
  ];

  return mechanicNames.map((mechanic, index) => {
    // Generate random coordinates within the specified radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (radiusKm / 111); // Convert km to degrees (rough approximation)
    const lat = centerLat + (distance * Math.cos(angle));
    const lng = centerLng + (distance * Math.sin(angle));

    // Calculate actual distance from center
    const actualDistance = calculateDistance(centerLat, centerLng, lat, lng);
    
    return {
      id: `dummy-${index + 1}`,
      name: mechanic.business,
      ownerName: mechanic.owner,
      rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 200) + 20,
      distance: actualDistance.toFixed(1),
      estimatedArrival: Math.floor(10 + (actualDistance * 2)).toString(),
      phone: phoneNumbers[index],
      address: generateNigerianAddress(lat, lng),
      bio: generateBio(mechanic.business),
      latitude: lat,
      longitude: lng,
      available: Math.random() > 0.2, // 80% availability
      responseTime: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
      services: {
        towing: Math.random() > 0.2,
        jumpStart: Math.random() > 0.1,
        tireFix: Math.random() > 0.1,
        fuelDelivery: Math.random() > 0.3,
        lockoutService: Math.random() > 0.4,
        basicRepair: Math.random() > 0.2,
      },
      image: profileImages[index],
    };
  });
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Generate realistic Nigerian addresses
const generateNigerianAddress = (lat: number, lng: number): string => {
  const streets = [
    'Herbert Macaulay Way', 'Ahmadu Bello Way', 'Adeola Odeku Street', 'Allen Avenue',
    'Ikorodu Road', 'Lagos-Ibadan Expressway', 'Airport Road', 'Ring Road',
    'Independence Avenue', 'Constitution Avenue', 'Kaduna Street', 'Kano Street',
    'Port Harcourt Road', 'Enugu Road', 'Calabar Street', 'Jos Street'
  ];
  
  const areas = [
    'Victoria Island', 'Ikoyi', 'Maryland', 'Ikeja', 'Surulere', 'Yaba',
    'Garki', 'Wuse', 'Maitama', 'Utako', 'Gwarinpa', 'Kubwa',
    'GRA', 'Trans Amadi', 'Old GRA', 'Mile 3', 'Rumuola', 'Eliozu'
  ];

  const states = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'];
  
  const streetNumber = Math.floor(Math.random() * 999) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const area = areas[Math.floor(Math.random() * areas.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  
  return `${streetNumber} ${street}, ${area}, ${state}`;
};

// Generate realistic bios
const generateBio = (businessName: string): string => {
  const experiences = ['over 10 years', 'more than 15 years', '8+ years', 'over 12 years'];
  const specialties = [
    'emergency roadside assistance',
    'vehicle diagnostics and repair',
    'automotive electrical systems',
    'engine repair and maintenance',
    'brake and suspension services'
  ];
  
  const experience = experiences[Math.floor(Math.random() * experiences.length)];
  const specialty = specialties[Math.floor(Math.random() * specialties.length)];
  
  return `With ${experience} of experience, ${businessName} specializes in ${specialty}. We pride ourselves on fast response times and quality service at fair prices across Nigeria.`;
};

export const useDummyMechanics = () => {
  const [mechanics, setMechanics] = useState<DummyMechanic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateMechanicsForLocation = async (latitude: number, longitude: number, radiusKm: number = 20) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyMechanics = generateMechanicsAroundLocation(latitude, longitude, radiusKm);
      setMechanics(dummyMechanics);
      
      toast.success(`Found ${dummyMechanics.length} mechanics nearby`);
    } catch (error) {
      console.error('Error generating mechanics:', error);
      toast.error('Failed to find nearby mechanics');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMechanics = () => {
    setMechanics([]);
  };

  return {
    mechanics,
    isLoading,
    generateMechanicsForLocation,
    clearMechanics,
  };
};