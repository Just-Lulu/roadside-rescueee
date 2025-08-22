-- Fix critical security issues with data exposure

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can view mechanic profiles" ON public.mechanic_profiles;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

-- Create more secure policies for mechanic_profiles
-- Allow public access to basic business information only
CREATE POLICY "Public can view basic mechanic info" 
ON public.mechanic_profiles 
FOR SELECT 
USING (true);

-- But we need to be more restrictive. Let's create policies that protect sensitive data
-- First, let's recreate with authentication requirement for full access
DROP POLICY IF EXISTS "Public can view basic mechanic info" ON public.mechanic_profiles;

CREATE POLICY "Authenticated users can view mechanic profiles" 
ON public.mechanic_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create more secure policy for reviews that requires authentication
CREATE POLICY "Authenticated users can view reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create a function to get public mechanic data (without sensitive info)
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

-- Create a function to get public reviews (without exposing user_id)
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