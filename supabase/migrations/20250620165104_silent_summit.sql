/*
  # Fix User Profile Creation Trigger

  1. Drop and recreate the handle_new_user function with better error handling
  2. Ensure the trigger works properly with the user metadata
*/

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_username text;
  user_full_name text;
  user_role user_role;
BEGIN
  -- Extract data from metadata with fallbacks
  user_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'user'::user_role
  );

  -- Insert profile with error handling
  INSERT INTO public.profiles (
    id,
    email,
    username,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_username,
    user_full_name,
    user_role,
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also ensure the profiles table has proper constraints
DO $$
BEGIN
  -- Add constraint to ensure username is not empty
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_username_not_empty'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_not_empty 
    CHECK (length(trim(username)) > 0);
  END IF;

  -- Add constraint to ensure full_name is not empty
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_full_name_not_empty'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_full_name_not_empty 
    CHECK (length(trim(full_name)) > 0);
  END IF;
END $$;