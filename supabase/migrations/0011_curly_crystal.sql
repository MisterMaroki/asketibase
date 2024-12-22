/*
  # Enable anonymous authentication
  
  1. Changes
    - Update RLS policies to support anonymous users
    - Remove email/password requirements
  
  2. Security
    - Maintain basic RLS for data protection
    - Allow anonymous users to create profiles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for own profile" ON users;

-- Create new policies for anonymous auth
CREATE POLICY "Allow read access for all users"
  ON users FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow profile creation for all users"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Allow profile updates for owners"
  ON users FOR UPDATE
  TO anon, authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());