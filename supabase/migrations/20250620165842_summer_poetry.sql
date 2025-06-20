/*
  # Add INSERT policy for profiles table

  1. Security
    - Add policy for authenticated users to insert their own profile data
    - This allows new users to create their profile during registration
    - Policy ensures users can only insert data for their own user ID

  2. Changes
    - Create INSERT policy on profiles table
    - Allow authenticated users to insert profiles where auth.uid() = id
*/

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);