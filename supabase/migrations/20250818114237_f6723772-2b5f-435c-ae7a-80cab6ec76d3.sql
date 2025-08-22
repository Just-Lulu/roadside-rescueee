-- Add mechanic_id column to mechanic_profiles table
ALTER TABLE public.mechanic_profiles 
ADD COLUMN mechanic_id text UNIQUE;

-- Create function to generate unique mechanic ID
CREATE OR REPLACE FUNCTION generate_mechanic_id()
RETURNS text AS $$
DECLARE
    new_id text;
    done bool := false;
BEGIN
    WHILE NOT done LOOP
        -- Generate mechanic ID in format: MEC-XXXXXX (6 random digits)
        new_id := 'MEC-' || LPAD(floor(random() * 999999)::text, 6, '0');
        
        -- Check if ID already exists
        IF NOT EXISTS (SELECT 1 FROM mechanic_profiles WHERE mechanic_id = new_id) THEN
            done := true;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate mechanic_id on insert
CREATE OR REPLACE FUNCTION set_mechanic_id()
RETURNS trigger AS $$
BEGIN
    IF NEW.mechanic_id IS NULL THEN
        NEW.mechanic_id := generate_mechanic_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_set_mechanic_id
    BEFORE INSERT ON public.mechanic_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_mechanic_id();

-- Update existing records to have mechanic IDs
UPDATE public.mechanic_profiles 
SET mechanic_id = generate_mechanic_id() 
WHERE mechanic_id IS NULL;