/*
  # Add admin authentication

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `auth_id` (uuid, references auth.users)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admins` table
    - Add policy for authenticated users to read their own admin status
*/

-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read their own status
CREATE POLICY "Users can check their admin status"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

-- Create indexes
CREATE INDEX idx_admins_auth_id ON admins(auth_id);
CREATE INDEX idx_admins_email ON admins(email);