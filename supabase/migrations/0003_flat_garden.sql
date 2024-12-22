/*
  # Add pricing matrices and calculations

  1. New Tables
    - `country_base_prices`
      - Base prices per country of residence
    - `age_factors`
      - Age bracket multipliers
    - `coverage_factors` 
      - Location coverage additional costs
    - `medical_risk_factors`
      - Medical risk level pricing

  2. Security
    - Enable RLS on all tables
    - Add policies for read access
*/

-- Country base prices table
CREATE TABLE country_base_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL UNIQUE,
  base_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Age bracket factors
CREATE TABLE age_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_age INTEGER NOT NULL,
  max_age INTEGER NOT NULL,
  daily_rate DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT age_range_check CHECK (min_age <= max_age),
  CONSTRAINT unique_age_range UNIQUE (min_age, max_age)
);

-- Coverage location factors
CREATE TABLE coverage_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coverage_type TEXT NOT NULL UNIQUE,
  daily_rate DECIMAL(10,2) NOT NULL,
  includes_high_risk BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Medical risk factors
CREATE TABLE medical_risk_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  risk_level INTEGER NOT NULL UNIQUE,
  daily_rate DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert age factors
INSERT INTO age_factors (min_age, max_age, daily_rate) VALUES
  (0, 15, 0.50),
  (16, 35, 0.75),
  (36, 50, 1.00),
  (51, 60, 1.50),
  (61, 65, 2.50),
  (66, 70, 6.00),
  (71, 85, 7.00);

-- Insert coverage factors
INSERT INTO coverage_factors (coverage_type, daily_rate, includes_high_risk) VALUES
  ('WORLDWIDE', 0.25, false),
  ('PLATINUM', 0.50, true);

-- Insert medical risk factors
INSERT INTO medical_risk_factors (risk_level, daily_rate, description) VALUES
  (0, 0.00, 'No Medical Conditions Declared'),
  (1, 2.00, 'Medical Conditions Declared - Level One'),
  (2, 0.00, 'Medical Conditions Declared - Level Two (Coverage Declined)');

-- Enable RLS
ALTER TABLE country_base_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_risk_factors ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for pricing tables
CREATE POLICY "Allow read access to country base prices"
  ON country_base_prices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to age factors"
  ON age_factors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to coverage factors"
  ON coverage_factors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to medical risk factors"
  ON medical_risk_factors FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes
CREATE INDEX idx_country_base_prices_country ON country_base_prices(country);
CREATE INDEX idx_age_factors_age_range ON age_factors(min_age, max_age);
CREATE INDEX idx_coverage_factors_type ON coverage_factors(coverage_type);
CREATE INDEX idx_medical_risk_factors_level ON medical_risk_factors(risk_level);