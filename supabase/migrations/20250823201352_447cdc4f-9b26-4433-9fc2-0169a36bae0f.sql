-- Create the missing mechanic ID generation function
CREATE OR REPLACE FUNCTION public.generate_mechanic_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    new_id text;
    done bool := false;
BEGIN
    WHILE NOT done LOOP
        -- Generate mechanic ID in format: MEC-XXXXXX (6 random digits)
        new_id := 'MEC-' || LPAD(floor(random() * 999999)::text, 6, '0');
        
        -- Check if ID already exists
        IF NOT EXISTS (SELECT 1 FROM public.mechanic_profiles WHERE mechanic_id = new_id) THEN
            done := true;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$function$;

-- Create trigger to auto-generate mechanic_id
CREATE OR REPLACE FUNCTION public.set_mechanic_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    IF NEW.mechanic_id IS NULL THEN
        NEW.mechanic_id := generate_mechanic_id();
    END IF;
    RETURN NEW;
END;
$function$;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS trigger_set_mechanic_id ON public.mechanic_profiles;
CREATE TRIGGER trigger_set_mechanic_id
    BEFORE INSERT ON public.mechanic_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_mechanic_id();