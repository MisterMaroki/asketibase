/*
 # Link quotes to memberships
 
 1. Changes
 - Add membership_id column to quotes table
 - Add foreign key constraint to appmembershipsble
 - Update RLS policies to restrict access based on membership ownership
 - Add index for efficient joins
 
 2. Security
 - Update RLS policies to check membership ownership
 */
-- Add membership_id to quotes
ALTER TABLE
  quotes
ADD
  COLUMN membership_id UUID REFERENCES memberships(id);

-- Create index for foreign key
CREATE INDEX idx_quotes_membership_id ON quotes(membership_id);

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read own quotes" ON quotes;

DROP POLICY IF EXISTS "Users can create quotes" ON quotes;

-- Create new RLS policies
CREATE POLICY "Users can read quotes for their memberships" ON quotes FOR
SELECT
  TO authenticated USING (
    membership_id IN (
      SELECT
        id
      FROM
        memberships
      WHERE
        user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create quotes for their memberships" ON quotes FOR
INSERT
  TO authenticated WITH CHECK (
    membership_id IN (
      SELECT
        id
      FROM
        memberships
      WHERE
        user_id = auth.uid()
    )
  );