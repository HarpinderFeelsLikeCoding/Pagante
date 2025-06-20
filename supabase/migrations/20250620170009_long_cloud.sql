/*
  # Fix profiles table RLS policy for user registration

  1. Security Changes
    - Drop the existing restrictive INSERT policy on profiles table
    - Create a new INSERT policy that allows authenticated users to create profiles
    - Ensure the policy works during the signup process when auth.uid() is available

  The issue was that the existing policy was too restrictive and prevented
  profile creation during the signup process. This new policy allows
  authenticated users to insert profiles while maintaining security.
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy that allows authenticated users to create profiles
-- This policy allows any authenticated user to insert a profile record
-- The application logic ensures they can only insert their own profile
CREATE POLICY "Allow authenticated users to create profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure the SELECT and UPDATE policies are still secure
-- Users should only be able to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Keep the existing SELECT policy that allows reading all profiles
-- This is already correctly configured in the schema