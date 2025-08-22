import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useRealTimeUpdates() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Listen for service request updates
    const serviceRequestsChannel = supabase
      .channel('service-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Service request update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new.status;
            const oldStatus = payload.old?.status;
            
            if (newStatus !== oldStatus) {
              toast.success(`Service request ${newStatus}!`);
            }
          }
        }
      )
      .subscribe();

    // Listen for mechanic profile updates
    const mechanicChannel = supabase
      .channel('mechanic-profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mechanic_profiles'
        },
        (payload) => {
          console.log('Mechanic profile update:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.info('New mechanic available in your area!');
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(serviceRequestsChannel);
      supabase.removeChannel(mechanicChannel);
    };
  }, [user]);

  // Function to enable real-time for specific service request
  const subscribeToServiceRequest = (requestId: string, onUpdate: (payload: any) => void) => {
    const channel = supabase
      .channel(`service-request-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'service_requests',
          filter: `id=eq.${requestId}`
        },
        onUpdate
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  return {
    subscribeToServiceRequest
  };
}