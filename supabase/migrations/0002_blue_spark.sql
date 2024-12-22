/*
  # Schema update for application data

  1. New Tables
    - `applications`
      - Core application details including membership type, coverage, etc.
    - `members`
      - Member information for each application
    - `medical_declarations`
      - Medical screening responses for each member

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  membership_type TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  duration_type TEXT NOT NULL,
  nationality TEXT NOT NULL,
  currency TEXT NOT NULL,
  start_date DATE NOT NULL,
  referral_code TEXT,
  referral_source TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) NOT NULL,
  salutation TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  nationality TEXT NOT NULL,
  country_code TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  country_of_residence TEXT NOT NULL,
  address TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Medical declarations table
CREATE TABLE medical_declarations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) NOT NULL,
  has_conditions BOOLEAN NOT NULL,
  responses JSONB,
  risk_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_declarations ENABLE ROW LEVEL SECURITY;

-- Application policies
CREATE POLICY "Users can read own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Member policies
CREATE POLICY "Users can read their members"
  ON members FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- Medical declaration policies
CREATE POLICY "Users can read their medical declarations"
  ON medical_declarations FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT m.id FROM members m
      JOIN applications a ON m.application_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create medical declarations"
  ON medical_declarations FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id IN (
      SELECT m.id FROM members m
      JOIN applications a ON m.application_id = a.id
      WHERE a.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_members_application_id ON members(application_id);
CREATE INDEX idx_medical_declarations_member_id ON medical_declarations(member_id);