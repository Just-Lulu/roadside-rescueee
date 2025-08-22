import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  user_type: 'driver' | 'mechanic';
  created_at: string;
  updated_at: string;
}

export function useProfiles() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) {
      toast.error('No profile to update');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return null;
    }
  };

  const switchUserType = async (newType: 'driver' | 'mechanic') => {
    if (!user) {
      toast.error('You must be logged in');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ user_type: newType })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as UserProfile);
      toast.success(`Switched to ${newType} mode!`);
      return data;
    } catch (error) {
      console.error('Error switching user type:', error);
      toast.error('Failed to switch user type');
      return null;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    switchUserType,
    refetch: fetchProfile
  };
}