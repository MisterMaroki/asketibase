/*
  # Fix authentication policies
  
  1. Changes
    - Add public access for initial user creation
    - Update RLS policies for proper auth flow
    - Add email verification handling
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies with proper access control
CREATE POLICY "Allow public read for email lookup"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create their profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid() AND
    email = auth.email()
  );

CREATE POLICY "Allow users to update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Add trigger to handle email verification
CREATE OR REPLACE FUNCTION handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_verified = auth.email() = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_email_update
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_email_verification();