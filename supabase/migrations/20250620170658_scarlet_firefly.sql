/*
  # Fix profiles table RLS policy for user registration

  1. Security Updates
    - Drop existing INSERT policy that's blocking profile creation
    - Create new INSERT policy that allows profile creation during signup
    - Ensure the policy works with the manual profile creation approach
    - Maintain security by validating the user can only create their own profile

  2. Changes
    - Remove overly restrictive INSERT policy
    - Add new policy that allows authenticated users to insert profiles
    - Keep existing UPDATE and SELECT policies intact
*/

-- Drop all existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to create profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies

-- Allow all authenticated users to read profiles (public information)
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert profiles during signup
-- We check that they're inserting their own profile by matching the ID
CREATE POLICY "Allow authenticated users to create profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Also ensure we have the proper function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists for updating timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();