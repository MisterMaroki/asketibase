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
CREATE POLICY "Service role can insert logs"
  ON logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_level ON logs(level);
CREATE INDEX idx_logs_operation ON logs(operation);