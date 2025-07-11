/*
  # Complete Documentation Platform Schema

  1. New Tables
    - `profiles` - User profiles with roles (admin/public)
    - `categories` - Documentation categories with icons and colors
    - `tags` - Tags for organizing content
    - `documents` - Main documentation content with Markdown support
    - `document_tags` - Many-to-many relationship between documents and tags
    - `app_settings` - Configurable application settings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can manage all content
    - Public users can only read published content

  3. Features
    - Full-text search on documents
    - SEO optimization with meta fields
    - Document status workflow (draft/published/archived)
    - View counting and analytics
    - Customizable app branding
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'public');
CREATE TYPE document_status AS ENUM ('draft', 'published', 'archived');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'public',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
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

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

-- Create documents table
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

-- Create document_tags junction table
CREATE TABLE IF NOT EXISTS document_tags (
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- Create app_settings table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category_id);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
CREATE INDEX IF NOT EXISTS documents_slug_idx ON documents(slug);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS documents_search_idx ON documents 
USING gin(to_tsvector('english', title || ' ' || description || ' ' || content));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment document views
CREATE OR REPLACE FUNCTION increment_document_views(doc_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE documents 
  SET view_count = view_count + 1 
  WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create RLS policies for categories
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

-- Create RLS policies for tags
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

-- Create RLS policies for documents
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

-- Create RLS policies for document_tags
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

-- Create RLS policies for app_settings
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

-- Insert default app settings
INSERT INTO app_settings (
  site_name,
  site_description,
  accent_color,
  footer_text,
  enable_search,
  enable_dark_mode,
  default_theme
) VALUES (
  'Documentation Hub',
  'Your comprehensive documentation platform',
  '#A855F7',
  'Built with love for great documentation',
  true,
  true,
  'light'
) ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
  ('Getting Started', 'getting-started', 'Essential guides to get you up and running', 'rocket', '#22C55E', 1),
  ('API Reference', 'api-reference', 'Complete API documentation and examples', 'code', '#3B82F6', 2),
  ('Tutorials', 'tutorials', 'Step-by-step tutorials and guides', 'book-open', '#F59E0B', 3),
  ('FAQ', 'faq', 'Frequently asked questions and answers', 'help-circle', '#EF4444', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (name, slug, color) VALUES
  ('Beginner', 'beginner', '#22C55E'),
  ('Advanced', 'advanced', '#EF4444'),
  ('API', 'api', '#3B82F6'),
  ('Tutorial', 'tutorial', '#F59E0B'),
  ('Guide', 'guide', '#8B5CF6'),
  ('Reference', 'reference', '#06B6D4')
ON CONFLICT (slug) DO NOTHING;