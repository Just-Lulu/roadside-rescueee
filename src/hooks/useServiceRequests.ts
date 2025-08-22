import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ServiceRequest {
  id: string;
  user_id: string;
  mechanic_id?: string;
  vehicle_id?: string;
  issue_type: 'flat-tire' | 'dead-battery' | 'engine-trouble' | 'out-of-fuel' | 'locked-out' | 'other';
  description: string;
  contact_method: 'phone' | 'message';
  phone_number?: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  location_latitude?: number;
  location_longitude?: number;
  location_address?: string;
  estimated_arrival?: number;
  created_at: string;
  updated_at: string;
}

export function useServiceRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as ServiceRequest[]);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: {
    mechanic_id?: string;
    vehicle_id?: string;
    issue_type: ServiceRequest['issue_type'];
    description: string;
    contact_method: ServiceRequest['contact_method'];
    phone_number?: string;
    location_latitude?: number;
    location_longitude?: number;
    location_address?: string;
  }) => {
    if (!user) {
      toast.error('You must be logged in to create a service request');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('service_requests')
        .insert([{ ...requestData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setRequests(prev => [data as ServiceRequest, ...prev]);
      toast.success('Service request created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating service request:', error);
      toast.error('Failed to create service request');
      return null;
    }
  };

  const updateRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRequests(prev => prev.map(r => r.id === id ? data as ServiceRequest : r));
      toast.success(`Request ${status} successfully!`);
      return data;
    } catch (error) {
      console.error('Error updating service request:', error);
      toast.error('Failed to update service request');
      return null;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  return {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    refetch: fetchRequests
  };
}