-- Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  photo TEXT,
  bio TEXT,
  social JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  status TEXT,
  price BIGINT,
  location JSONB,
  bedrooms INTEGER,
  bathrooms INTEGER,
  size INTEGER,
  images TEXT[],
  description TEXT,
  amenities TEXT[],
  agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Clicks Table (for per-listing click tracking)
CREATE TABLE IF NOT EXISTS property_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT REFERENCES properties(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_clicks ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read Access)
-- Drop existing policies first to avoid "already exists" errors
DROP POLICY IF EXISTS "Public Read Agents" ON agents;
CREATE POLICY "Public Read Agents" ON agents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Properties" ON properties;
CREATE POLICY "Public Read Properties" ON properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Clicks" ON property_clicks;
CREATE POLICY "Public Insert Clicks" ON property_clicks FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Clicks" ON property_clicks;
CREATE POLICY "Public Read Clicks" ON property_clicks FOR SELECT USING (true);

-- Admin Policies (Full access for authenticated users)
DROP POLICY IF EXISTS "Admin All Agents" ON agents;
CREATE POLICY "Admin All Agents" ON agents FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin All Properties" ON properties;
CREATE POLICY "Admin All Properties" ON properties FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin All Clicks" ON property_clicks;
CREATE POLICY "Admin All Clicks" ON property_clicks FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- Create Admin Invites Table (for registration codes)
CREATE TABLE IF NOT EXISTS admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Admin Invites
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;

-- Allow public to request a code (insert only)
DROP POLICY IF EXISTS "Allow public insert to admin_invites" ON admin_invites;
CREATE POLICY "Allow public insert to admin_invites" 
ON admin_invites FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admins to manage all codes
DROP POLICY IF EXISTS "Admin manage all invites" ON admin_invites;
CREATE POLICY "Admin manage all invites" 
ON admin_invites FOR ALL 
USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

-- 1. First, we revoke public select and update to prevent browsing the table
-- (This is handled by not creating public SELECT/UPDATE policies)

-- 2. Create a secure function to verify and use a code
-- This function runs with "SECURITY DEFINER" to bypass RLS,
-- but it only returns a result if the exact code is known.
CREATE OR REPLACE FUNCTION verify_and_use_admin_code(input_code TEXT)
RETURNS TABLE (id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE admin_invites
  SET is_used = TRUE
  WHERE code = input_code 
    AND is_used = FALSE
  RETURNING admin_invites.id;
END;
$$;
