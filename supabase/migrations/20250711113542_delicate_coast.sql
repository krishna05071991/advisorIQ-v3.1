/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - Existing policies on user_profiles table are trying to query user_profiles table
    - This creates infinite recursion when checking permissions

  2. Solution
    - Drop ALL existing policies on user_profiles
    - Create simple policies that don't reference user_profiles table
    - Use auth.uid() and hard-coded admin emails to avoid recursion

  3. New Policies
    - Users can read their own profile (auth.uid() = id)
    - Specific admin users can read all profiles (no table recursion)
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "users_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_view_all_profiles" ON user_profiles;

-- Create simple policy for users to read their own profile
CREATE POLICY "users_read_own_profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy for admin users to read all profiles
-- Using auth.email() to avoid querying user_profiles table
CREATE POLICY "admin_read_all_profiles"
ON user_profiles
FOR SELECT
TO authenticated
USING (
  auth.email() IN ('admin@gmail.com')
);

-- Create policy for users to update their own profile
CREATE POLICY "users_update_own_profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policy for admin users to update all profiles
CREATE POLICY "admin_update_all_profiles"
ON user_profiles
FOR UPDATE
TO authenticated
USING (
  auth.email() IN ('admin@gmail.com')
);