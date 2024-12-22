/*
  # Make auth.users optional
  
  1. Changes
    - Remove foreign key constraint with auth.users
    - Add auth_id column for optional linking
    - Update RLS policies for public access
    
  2. Security
    - Maintain basic data protection
    - Allow anonymous access for initial user creation
    - Enable future account linking
*/

-- Remove existing foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Add optional auth_id column
ALTER TABLE users 
  DROP COLUMN IF EXISTS id CASCADE,
  ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ADD COLUMN auth_id UUID UNIQUE REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access for all users" ON users;
DROP POLICY IF EXISTS "Allow profile creation for all users" ON users;
DROP POLICY IF EXISTS "Allow profile updates for owners" ON users;

-- Create new policies
CREATE POLICY "Enable public read access"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable public insert"
  ON users FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable updates for linked accounts"
  ON users FOR UPDATE
  TO public
  USING (
    auth_id IS NULL OR 
    (auth.uid() IS NOT NULL AND auth_id = auth.uid())
  );