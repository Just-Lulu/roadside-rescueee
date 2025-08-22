-- Fix function security warnings by setting search_path

-- Update the public mechanic profiles function with secure search_path
CREATE OR REPLACE FUNCTION public.get_public_mechanic_profiles()
RETURNS TABLE (
  id uuid,
  business_name text,
  bio text,
  services_offered jsonb,
  business_hours jsonb,
  rating numeric,
  review_count integer,
  is_available boolean,
  average_response_time integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.id,
    mp.business_name,
    mp.bio,
    mp.services_offered,
    mp.business_hours,
    mp.rating,
    mp.review_count,
    mp.is_available,
    mp.average_response_time,
    mp.created_at,
    mp.updated_at
  FROM public.mechanic_profiles mp
  WHERE mp.is_available = true;
END;
$$ LANGUAGE plpgsql;

-- Update the public reviews function with secure search_path
CREATE OR REPLACE FUNCTION public.get_public_reviews(mechanic_profile_id uuid)
RETURNS TABLE (
  id uuid,
  rating integer,
  comment text,
  created_at timestamp with time zone,
  service_request_id uuid,
  mechanic_id uuid
) 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    r.service_request_id,
    r.mechanic_id
  FROM public.reviews r
  WHERE r.mechanic_id = mechanic_profile_id;
END;
$$ LANGUAGE plpgsql;