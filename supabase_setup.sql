-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read projects
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (true);

-- Allow service role to manage projects
CREATE POLICY "Enable full access for service role" ON projects
  FOR ALL USING (auth.role() = 'service_role');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS projects_id_idx ON projects(id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at);
