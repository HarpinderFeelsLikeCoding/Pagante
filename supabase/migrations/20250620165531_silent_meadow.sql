/*
  # Disable automatic trigger and handle profile creation manually
  
  This migration disables the automatic profile creation trigger
  and allows the application to handle profile creation manually
  to avoid the 500 error.
*/

-- Drop the existing trigger that's causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- We'll handle profile creation manually in the application code
-- This avoids the database trigger issues we're experiencing