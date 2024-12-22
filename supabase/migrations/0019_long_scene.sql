/*
  # Update applications schema

  1. Changes
    - Remove nationality column from applications table
    - Add NOT NULL constraint to application_id in quotes table
    
  2. Data Migration
    - No data migration needed since we're removing a column
*/

-- Remove nationality column from applications
ALTER TABLE applications DROP COLUMN IF EXISTS nationality;

-- Add NOT NULL constraint to application_id in quotes
ALTER TABLE quotes 
  ALTER COLUMN application_id SET NOT NULL;

-- Update application policies to reflect schema changes
DROP POLICY IF EXISTS "Users can read own applications" ON applications;
DROP POLICY IF EXISTS "Users can create applications" ON applications;

CREATE POLICY "Users can read own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());