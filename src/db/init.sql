CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
USING (status = 'Published');

CREATE POLICY "Users can view own articles"
ON articles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert articles"
ON articles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own articles"
ON articles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own articles"
ON articles FOR DELETE
USING (auth.uid() = user_id);