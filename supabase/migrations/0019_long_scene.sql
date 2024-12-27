/*
 # Update memberships schema
 
 1. Changes
 - Remove nationality column from memberships table
 - Add NOT NULL constraint to membership_id in quotes table
 
 2. Data Migration
 - No data migration needed since we're removing a column
 */
-- Remove nationality column from memberships
ALTER TABLE
  memberships DROP COLUMN IF EXISTS nationality;

-- Add NOT NULL constraint to membership_id in quotes
ALTER TABLE
  quotes
ALTER COLUMN
  membership_id
SET
  NOT NULL;

-- Update membership policies to reflect schema changes
DROP POLICY IF EXISTS "Users can read own memberships" ON memberships;

DROP POLICY IF EXISTS "Users can create memberships" ON memberships;

CREATE POLICY "Users can read own memberships" ON memberships FOR
SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create memberships" ON memberships FOR
INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());