/*
  # Fix profiles table RLS policies for authentication flow

  1. Problem Analysis
    - Profile query returns 0 results even though profile exists
    - RLS policy violation (42501) when trying to create profiles
    - Current policies are blocking both read and write operations

  2. Solution
    - Ensure RLS is properly configured
    - Create permissive policies that allow authenticated users to access profiles
    - Fix the authentication flow by allowing profile creation and reading

  3. Security
    - Maintain security while allowing necessary operations
    - Users can read all profiles (public information)
    - Users can only create/update their own profiles
*/

-- First, ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to create profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create comprehensive policies that work with the authentication flow

-- 1. Allow all authenticated users to read profiles (this is public information)
CREATE POLICY "authenticated_users_can_read_profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. Allow authenticated users to insert their own profile
CREATE POLICY "authenticated_users_can_insert_own_profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. Allow users to update only their own profile
CREATE POLICY "authenticated_users_can_update_own_profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Allow users to delete only their own profile (optional, for completeness)
CREATE POLICY "authenticated_users_can_delete_own_profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Verify the policies are working by testing a simple query
-- This will help us debug if there are still issues