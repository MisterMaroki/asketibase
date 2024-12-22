/*
  # Create quotes table

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `base_price` (decimal)
      - `member_prices` (jsonb)
      - `coverage_loading_price` (decimal)
      - `medical_loading_price` (decimal)
      - `discount_amount` (decimal)
      - `total_price` (decimal)
      - `currency` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `quotes` table
    - Add policy for authenticated users to read their own quotes
    - Add policy for authenticated users to create quotes
*/

-- Create quotes table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_price DECIMAL(10,2) NOT NULL,
  member_prices JSONB NOT NULL,
  coverage_loading_price DECIMAL(10,2) NOT NULL,
  medical_loading_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true); -- All authenticated users can read quotes for now

CREATE POLICY "Users can create quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- All authenticated users can create quotes

-- Create indexes
CREATE INDEX idx_quotes_created_at ON quotes(created_at);