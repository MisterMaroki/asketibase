/*
  # Link quotes to applications

  1. Changes
    - Add application_id column to quotes table
    - Add foreign key constraint to applications table
    - Update RLS policies to restrict access based on application ownership
    - Add index for efficient joins

  2. Security
    - Update RLS policies to check application ownership
*/

-- Add application_id to quotes
ALTER TABLE quotes 
ADD COLUMN application_id UUID REFERENCES applications(id);

-- Create index for foreign key
CREATE INDEX idx_quotes_application_id ON quotes(application_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can create quotes" ON quotes;

-- Create new RLS policies
CREATE POLICY "Users can read quotes for their applications"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create quotes for their applications"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications 
      WHERE user_id = auth.uid()
    )
  );