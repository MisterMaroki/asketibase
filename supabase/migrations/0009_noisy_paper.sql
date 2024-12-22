-- Drop the email verification trigger and function
DROP TRIGGER IF EXISTS on_user_email_update ON users;
DROP FUNCTION IF EXISTS handle_email_verification;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read for email lookup" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to create their profile" ON users;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON users;

-- Create simplified policies without email verification
CREATE POLICY "Allow public read access"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow profile creation"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Allow profile updates"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());