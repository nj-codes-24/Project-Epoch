-- 0000_init_knowledge_hub.sql

-- ==========================================
-- 1. Tables Creation
-- ==========================================

-- Profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  skills text[],
  github_username text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Papers
CREATE TABLE papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arxiv_id text UNIQUE,
  semantic_id text UNIQUE,
  title text NOT NULL,
  plain_title text,
  summary text,
  why_it_matters text,
  category text NOT NULL,
  topic_tags text[],
  citation_count integer DEFAULT 0,
  published_at timestamptz,
  processed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Tools
CREATE TABLE tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id uuid REFERENCES papers(id) ON DELETE SET NULL,
  github_url text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  stars integer DEFAULT 0,
  forks integer DEFAULT 0,
  last_commit_at timestamptz,
  is_deprecated boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- User Seen Papers
CREATE TABLE user_seen_papers (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_id uuid REFERENCES papers(id) ON DELETE CASCADE,
  seen_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, paper_id)
);

-- Saved Papers
CREATE TABLE saved_papers (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_id uuid REFERENCES papers(id) ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, paper_id)
);

-- Saved Tools
CREATE TABLE saved_tools (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, tool_id)
);


-- ==========================================
-- 2. Indexes
-- ==========================================
CREATE INDEX idx_papers_category ON papers(category);
CREATE INDEX idx_papers_topic_tags ON papers USING GIN(topic_tags);
CREATE INDEX idx_papers_processed_at ON papers(processed_at DESC);
CREATE INDEX idx_user_seen_papers_user ON user_seen_papers(user_id);
CREATE INDEX idx_saved_papers_user ON saved_papers(user_id);
CREATE INDEX idx_saved_tools_user ON saved_tools(user_id);


-- ==========================================
-- 3. Row Level Security (RLS)
-- ==========================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All authenticated users can read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Papers
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All authenticated users can read papers" ON papers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role only insert" ON papers FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "Service role only update" ON papers FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Service role only delete" ON papers FOR DELETE TO authenticated USING (false);

-- Tools
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All authenticated users can read tools" ON tools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Service role only insert" ON tools FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "Service role only update" ON tools FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Service role only delete" ON tools FOR DELETE TO authenticated USING (false);

-- User Seen Papers
ALTER TABLE user_seen_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own seen papers" ON user_seen_papers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own seen papers" ON user_seen_papers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Never update seen papers" ON user_seen_papers FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Users can delete own seen papers" ON user_seen_papers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Saved Papers
ALTER TABLE saved_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own saved papers" ON saved_papers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved papers" ON saved_papers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Never update saved papers" ON saved_papers FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Users can delete own saved papers" ON saved_papers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Saved Tools
ALTER TABLE saved_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own saved tools" ON saved_tools FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved tools" ON saved_tools FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Never update saved tools" ON saved_tools FOR UPDATE TO authenticated USING (false);
CREATE POLICY "Users can delete own saved tools" ON saved_tools FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- ==========================================
-- 4. Triggers
-- ==========================================

-- Trigger to automatically create a profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'user_name',
      'user_' || substr(new.id::text, 1, 8)
    ),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
