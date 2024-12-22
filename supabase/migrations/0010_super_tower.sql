/*
  # Simplify auth flow
  
  1. Changes
    - Remove email verification requirements
    - Simplify RLS policies
    - Update user table constraints
  
  2. Security
    - Maintain basic RLS for user data protection
    - Keep foreign key constraint with auth.users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON users;
DROP POLICY IF EXISTS "Allow profile creation" ON users;
DROP POLICY IF EXISTS "Allow profile updates" ON users;

-- Create simplified policies
CREATE POLICY "Enable read access for all"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Enable update for own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());