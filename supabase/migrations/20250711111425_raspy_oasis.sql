/*
  # Add User Profiles for Test Accounts

  1. New Records
    - Insert 6 user profiles into `user_profiles` table
    - 1 admin user (admin@gmail.com)
    - 5 advisor users (advisor1@gmail.com through advisor5@gmail.com)
  
  2. User Details
    - Admin User: Full system access with admin role
    - Advisor Users: Personal data access with advisor role
    - All users linked to their respective auth.users records via UUID
  
  3. Security
    - All users will inherit existing RLS policies
    - Role-based access control maintained through user_profiles.role column
*/

-- Insert admin user profile
INSERT INTO user_profiles (id, email, full_name, role)
VALUES (
  '5b098013-b066-4545-85a0-848af07f9d99',
  'admin@gmail.com',
  'Admin User',
  'admin'
);

-- Insert advisor user profiles
INSERT INTO user_profiles (id, email, full_name, role)
VALUES 
  (
    '87223fcb-02e8-4c11-af04-1f63d98107f4',
    'advisor1@gmail.com',
    'Advisor One',
    'advisor'
  ),
  (
    '14f80fc9-5d64-4614-ae1f-08ee5492777e',
    'advisor2@gmail.com',
    'Advisor Two',
    'advisor'
  ),
  (
    '698a5deb-d81a-4f8d-945f-cbc9408f45e4',
    'advisor3@gmail.com',
    'Advisor Three',
    'advisor'
  ),
  (
    '630ee642-5245-4644-91e2-284673217057',
    'advisor4@gmail.com',
    'Advisor Four',
    'advisor'
  ),
  (
    '0a0dc344-a142-4655-9089-d88f6ad8e5a3',
    'advisor5@gmail.com',
    'Advisor Five',
    'advisor'
  );