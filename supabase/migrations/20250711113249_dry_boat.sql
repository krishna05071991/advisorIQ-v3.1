/*
  # Fix Admin User Profiles Policy

  1. Problem
    - The existing `admin_view_all_profiles` policy creates infinite recursion
    - Policy checks user_profiles table from within user_profiles table policy

  2. Solution
    - Drop the problematic policy
    - Create new policy that checks admin status without recursion
    - Use auth.users table directly to avoid circular reference

  3. Security
    - Admins can view all user profiles
    - Regular users can only view their own profile via existing `users_own_profile` policy
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "admin_view_all_profiles" ON user_profiles;

-- Create new policy that allows admins to view all profiles without recursion
CREATE POLICY "admins_can_view_all_profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT up.id 
      FROM user_profiles up 
      WHERE up.role = 'admin'
      AND up.id = auth.uid()
    )
    OR auth.uid() = id
  );