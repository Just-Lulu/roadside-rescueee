import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  created_at: string;
  updated_at: string;
}

export function useVehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    if (!user) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast.error('You must be logged in to add a vehicle');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{ ...vehicleData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => [data, ...prev]);
      toast.success('Vehicle added successfully!');
      return data;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
      return null;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => prev.map(v => v.id === id ? data : v));
      toast.success('Vehicle updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
      return null;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Vehicle removed successfully!');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to remove vehicle');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  return {
    vehicles,
    loading,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
}