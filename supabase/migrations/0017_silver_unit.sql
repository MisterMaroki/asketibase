/*
  # Add initial admin user

  1. New Data
    - Add initial admin user entry
*/

-- Insert initial admin user
INSERT INTO admins (email, auth_id)
VALUES (
  'admin@asketi.com',
  '00000000-0000-0000-0000-000000000000'
);