import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MechanicProfile {
  id: string;
  user_id: string;
  mechanic_id?: string;
  business_name: string;
  phone?: string;
  bio?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  services_offered: any;
  business_hours: any;
  rating: number;
  review_count: number;
  is_available: boolean;
  average_response_time: number;
  created_at: string;
  updated_at: string;
}

export function useMechanicProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<MechanicProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      let data;
      
      if (user) {
        // Authenticated users can access full profiles including sensitive data
        const { data: fullData, error } = await supabase
          .from('mechanic_profiles')
          .select('*')
          .order('rating', { ascending: false });
        
        if (error) throw error;
        data = fullData;
      } else {
        // Unauthenticated users only get public data
        const { data: publicData, error } = await supabase
          .rpc('get_public_mechanic_profiles');
        
        if (error) throw error;
        data = publicData;
      }
      
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching mechanic profiles:', error);
      toast.error('Failed to load mechanics');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<MechanicProfile>) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('mechanic_profiles')
        .insert({ ...profileData, user_id: user.id, business_name: profileData.business_name || 'Business Name Required' })
        .select()
        .single();

      if (error) throw error;

      setProfiles(prev => [data, ...prev]);
      toast.success('Mechanic profile created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating mechanic profile:', error);
      toast.error('Failed to create profile');
      return null;
    }
  };

  const updateProfile = async (id: string, updates: Partial<MechanicProfile>) => {
    try {
      const { data, error } = await supabase
        .from('mechanic_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProfiles(prev => prev.map(p => p.id === id ? data : p));
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return null;
    }
  };

  const searchNearby = async (latitude: number, longitude: number, radiusKm: number = 50) => {
    try {
      let data;
      
      if (user) {
        // Authenticated users can access full profiles with location data
        const { data: fullData, error } = await supabase
          .from('mechanic_profiles')
          .select('*')
          .eq('is_available', true)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (error) throw error;
        data = fullData;
      } else {
        // For unauthenticated users, we can't do location-based search since location data is sensitive
        toast.error('Please log in to search for nearby mechanics');
        return [];
      }

      // Filter by distance (simple calculation)
      const nearby = (data || []).filter(profile => {
        if (!profile.latitude || !profile.longitude) return false;
        const distance = calculateDistance(latitude, longitude, profile.latitude, profile.longitude);
        return distance <= radiusKm;
      });

      return nearby;
    } catch (error) {
      console.error('Error searching nearby mechanics:', error);
      toast.error('Failed to find nearby mechanics');
      return [];
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    createProfile,
    updateProfile,
    searchNearby,
    refetch: fetchProfiles
  };
}

// Simple distance calculation (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}