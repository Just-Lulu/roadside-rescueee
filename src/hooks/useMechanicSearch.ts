
import { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { toast } from 'sonner';
import { useDummyMechanics } from './useDummyMechanics';

// Declare google object for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export const useMechanicSearch = () => {
  const [location, setLocation] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(20); // Default 20km radius
  
  const { mechanics, isLoading: mechanicsLoading, generateMechanicsForLocation, clearMechanics } = useDummyMechanics();

  // Handle location search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }
    
    setIsSearching(true);
    
    // If we have current location coordinates, use them to generate mechanics
    if (currentLocation) {
      generateMechanicsForLocation(currentLocation.lat, currentLocation.lng, searchRadius);
    }
    
    // Simulate search delay for text-based search
    setTimeout(() => {
      setIsSearching(false);
      console.log(`Searching near: ${location}`);
    }, 1000);
  };

  // Handle city selection
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setLocation(value);
    
    // Clear current mechanics and generate new ones based on city
    clearMechanics();
    setIsSearching(true);
    
    // Use approximate coordinates for major Nigerian cities
    const cityCoordinates: Record<string, {lat: number, lng: number}> = {
      'Lagos': { lat: 6.5244, lng: 3.3792 },
      'Abuja': { lat: 9.0765, lng: 7.3986 },
      'Port Harcourt': { lat: 4.8156, lng: 7.0498 },
      'Kano': { lat: 12.0022, lng: 8.5920 },
      'Ibadan': { lat: 7.3775, lng: 3.9470 },
    };
    
    const coords = cityCoordinates[value];
    if (coords) {
      setCurrentLocation(coords);
      generateMechanicsForLocation(coords.lat, coords.lng, searchRadius);
    }
    
    setTimeout(() => {
      console.log(`Filtering mechanics in ${value}`);
      setIsSearching(false);
    }, 800);
  };

  // Handle "Use my location" button with Google Maps geocoding
  const handleUseLocation = async () => {
    setIsSearching(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setLocation('Geolocation not supported');
      setIsSearching(false);
      return;
    }

    toast.info('Getting your location...');

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Always set current location from GPS coordinates first
      setCurrentLocation({ lat: latitude, lng: longitude });
      generateMechanicsForLocation(latitude, longitude, searchRadius);
      
      // Always use OpenStreetMap for geocoding (more reliable)
      await fallbackGeocoding(latitude, longitude);
      
      setIsSearching(false);
    } catch (error: any) {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to get location';
      
      if (error.code) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
      }
      
      toast.error(errorMessage);
      setLocation(errorMessage);
      setIsSearching(false);
    }
  };

  // Helper function to promisify geolocation
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    });
  };

  // Fallback geocoding using OpenStreetMap
  const fallbackGeocoding = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          setLocation(data.display_name);
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Generate mechanics around this location
          generateMechanicsForLocation(latitude, longitude, searchRadius);
          
          toast.success('Location found successfully!');
        } else {
          setLocation(`${latitude}, ${longitude}`);
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Generate mechanics around coordinates
          generateMechanicsForLocation(latitude, longitude, searchRadius);
          
          toast.success('Location found! Showing nearby mechanics.');
        }
      } else {
        setLocation(`${latitude}, ${longitude}`);
        setCurrentLocation({ lat: latitude, lng: longitude });
        
        // Generate mechanics around coordinates
        generateMechanicsForLocation(latitude, longitude, searchRadius);
        
        toast.success('Location found! Showing nearby mechanics.');
      }
    } catch (error) {
      console.error('Fallback geocoding error:', error);
      setLocation(`${latitude}, ${longitude}`);
      setCurrentLocation({ lat: latitude, lng: longitude });
      
      // Generate mechanics around coordinates
      generateMechanicsForLocation(latitude, longitude, searchRadius);
      
      toast.success('Location found! Showing nearby mechanics.');
    }
  };

  // Toggle mechanic selection
  const toggleMechanicSelection = (id: string) => {
    if (selectedMechanic === id) {
      setSelectedMechanic(null);
    } else {
      setSelectedMechanic(id);
    }
  };

  // Handle radius change for search area
  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    
    if (currentLocation) {
      // Clear current mechanics and generate new ones with updated radius
      clearMechanics();
      setIsSearching(true);
      
      // Simulate search delay
      setTimeout(() => {
        generateMechanicsForLocation(currentLocation.lat, currentLocation.lng, newRadius);
        setIsSearching(false);
      }, 800);
    }
  };

  return {
    location,
    setLocation,
    selectedCity,
    isSearching: isSearching || mechanicsLoading,
    mechanics,
    selectedMechanic,
    currentLocation,
    searchRadius,
    handleSearch,
    handleCityChange,
    handleUseLocation,
    toggleMechanicSelection,
    handleRadiusChange
  };
};
