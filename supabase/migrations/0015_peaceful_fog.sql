/*
  # Fix logs table and permissions

  1. Changes
    - Drop existing logs table if exists
    - Create new logs table with proper structure
    - Set up correct RLS policies for service role
    - Grant necessary permissions
    
  2. Security
    - Enable RLS on logs table
    - Allow service role full access
    - Restrict access to only service role
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS logs CASCADE;

-- Create logs table
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  operation TEXT NOT NULL,
  details JSONB,
  error TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only
CREATE POLICY "Service role can manage logs"
  ON logs
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant permissions to service role
GRANT ALL ON logs TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Create indexes for better query performance
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_level ON logs(level);
CREATE INDEX idx_logs_operation ON logs(operation);