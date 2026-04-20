-- Create Agents Table
CREATE TABLE agents (
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
CREATE TABLE properties (
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
  agent_id TEXT REFERENCES agents(id),
  featured BOOLEAN DEFAULT FALSE,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Clicks Table (for per-listing click tracking)
CREATE TABLE property_clicks (
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
CREATE POLICY "Public Read Agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Public Read Properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public Insert Clicks" ON property_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Clicks" ON property_clicks FOR SELECT USING (true);

-- Admin Policies (Placeholder - you'll need to set up auth for this)
-- Example: CREATE POLICY "Admin All Agents" ON agents FOR ALL USING (auth.role() = 'authenticated');

-- Create Admin Invites Table (for registration codes)
CREATE TABLE admin_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Admin Invites
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a new code (to request registration)
-- In a production app, you might want to rate limit this or restrict it.
CREATE POLICY "Allow public insert to admin_invites" 
ON admin_invites FOR INSERT 
WITH CHECK (true);

-- Allow public to read their own code for verification during signup
CREATE POLICY "Allow public select from admin_invites" 
ON admin_invites FOR SELECT 
USING (true);

-- Allow updates (marking as used)
CREATE POLICY "Allow public update to admin_invites" 
ON admin_invites FOR UPDATE 
USING (true) 
WITH CHECK (true);
