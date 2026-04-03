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

-- Create the site_settings table for hero and about images
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT PRIMARY KEY,
  hero_image TEXT,
  about_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow anonymous Users to read projects
CREATE POLICY "Enable read access for all users" ON projects
  FOR SELECT USING (true);

-- Allow service role to manage projects
CREATE POLICY "Enable full access for service role" ON projects
  FOR ALL USING (auth.role() = 'service_role');

-- Enable Row Level Security for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read site settings
CREATE POLICY "Enable read access for all users" ON site_settings
  FOR SELECT USING (true);

-- Allow service role to manage site settings
CREATE POLICY "Enable full access for service role" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS projects_id_idx ON projects(id);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at);
CREATE INDEX IF NOT EXISTS site_settings_id_idx ON site_settings(id);
