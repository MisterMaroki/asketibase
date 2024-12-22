-- Update logs table policy
DROP POLICY IF EXISTS "Service role can manage logs" ON logs;

-- Create new policy to allow public inserts
CREATE POLICY "Allow public inserts to logs"
  ON logs
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for service role to read logs
CREATE POLICY "Service role can read logs"
  ON logs
  FOR SELECT
  TO service_role
  USING (true);

-- Grant insert permission to public
GRANT INSERT ON logs TO public;