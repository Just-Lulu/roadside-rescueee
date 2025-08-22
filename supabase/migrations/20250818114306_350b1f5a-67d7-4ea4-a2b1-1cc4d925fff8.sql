-- Fix security warnings for the new functions
ALTER FUNCTION generate_mechanic_id() SECURITY DEFINER SET search_path TO '';
ALTER FUNCTION set_mechanic_id() SECURITY DEFINER SET search_path TO '';