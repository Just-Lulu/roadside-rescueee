-- Enable real-time for service_requests and mechanic_profiles tables
ALTER TABLE public.service_requests REPLICA IDENTITY FULL;
ALTER TABLE public.mechanic_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mechanic_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;