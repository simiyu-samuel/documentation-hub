/*
  # Documentation Hosting Database Schema

  1. New Tables
    - `profiles` - User profiles with roles (admin/public)
    - `categories` - Documentation categories
    - `tags` - Documentation tags
    - `documents` - Main documentation content
    - `document_tags` - Many-to-many relationship for documents and tags
    - `app_settings` - Configurable app settings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can manage all content
    - Public users can only read published content

  3. Features
    - Full-text search capabilities
    - SEO-friendly slugs
    - File upload support via Supabase Storage
    - Audit trail with created_at/updated_at timestamps
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'public');
CREATE TYPE document_status AS ENUM ('draft', 'published', 'archived');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'public',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#3B82F6',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status document_status DEFAULT 'draft',
  featured boolean DEFAULT false,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  view_count integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Document tags junction table
CREATE TABLE IF NOT EXISTS document_tags (
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- App settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'Documentation Hub',
  site_description text DEFAULT 'Your comprehensive documentation platform',
  logo_url text,
  favicon_url text,
  accent_color text DEFAULT '#3B82F6',
  footer_text text DEFAULT 'Built with love for great documentation',
  enable_search boolean DEFAULT true,
  enable_dark_mode boolean DEFAULT true,
  default_theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default app settings
INSERT INTO app_settings (site_name, site_description) 
VALUES ('Documentation Hub', 'Your comprehensive documentation platform')
ON CONFLICT DO NOTHING;

-- Create search index for documents
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents 
USING gin(to_tsvector('english', title || ' ' || description || ' ' || content));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category_id);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
CREATE INDEX IF NOT EXISTS documents_slug_idx ON documents(slug);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Tags policies
CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Anyone can read published documents"
  ON documents FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all documents"
  ON documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Document tags policies
CREATE POLICY "Anyone can read document tags"
  ON document_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage document tags"
  ON document_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- App settings policies
CREATE POLICY "Anyone can read app settings"
  ON app_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage app settings"
  ON app_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create storage bucket for document assets
INSERT INTO storage.buckets (id, name, public) VALUES ('document-assets', 'document-assets', true);

-- Storage policies
CREATE POLICY "Anyone can read document assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'document-assets');

CREATE POLICY "Admins can manage document assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'document-assets' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_document_views(doc_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE documents
  SET view_count = view_count + 1
  WHERE id = doc_id;
END;
$$ language 'plpgsql';