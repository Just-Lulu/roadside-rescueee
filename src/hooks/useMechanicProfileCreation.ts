import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { MechanicProfile } from './useMechanicProfiles';

export function useMechanicProfileCreation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<MechanicProfile | null>(null);

  // Check if user already has a mechanic profile
  const checkExistingProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mechanic_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking existing profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in checkExistingProfile:', error);
    }
  };

  // Create mechanic profile after successful signup
  const createMechanicProfile = async (formData: any, services: any) => {
    if (!user) {
      toast.error('User must be logged in to create profile');
      return false;
    }

    setLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        business_name: formData.businessName,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.businessAddress,
        services_offered: services,
        business_hours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '08:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '14:00', closed: false }
        },
        is_available: true,
        rating: 5.0,
        review_count: 0,
        average_response_time: 15
      };

      const { data, error } = await supabase
        .from('mechanic_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating mechanic profile:', error);
        toast.error('Failed to create mechanic profile: ' + error.message);
        return false;
      }

      setProfile(data);
      toast.success(`Mechanic profile created successfully! Your ID: ${data.mechanic_id}`);
      return true;
    } catch (error) {
      console.error('Error in createMechanicProfile:', error);
      toast.error('Failed to create mechanic profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkExistingProfile();
  }, [user]);

  return {
    loading,
    profile,
    createMechanicProfile,
    checkExistingProfile
  };
}