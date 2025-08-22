import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PublicReview {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  service_request_id: string;
  mechanic_id: string;
  // Note: user_id is intentionally excluded for privacy
}

export function usePublicReviews(mechanicId?: string) {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (mechanic_id: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_public_reviews', { mechanic_profile_id: mechanic_id });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mechanicId) {
      fetchReviews(mechanicId);
    } else {
      setLoading(false);
    }
  }, [mechanicId]);

  return {
    reviews,
    loading,
    refetch: mechanicId ? () => fetchReviews(mechanicId) : () => {}
  };
}