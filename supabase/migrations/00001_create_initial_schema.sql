-- 文化模板表
CREATE TABLE culture_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  era TEXT NOT NULL,
  region TEXT NOT NULL,
  special_attributes JSONB DEFAULT '[]'::jsonb,
  is_official BOOLEAN DEFAULT true,
  creator_id TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 事件表
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  culture_id UUID REFERENCES culture_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('childhood', 'youth', 'adult', 'elder')),
  choices JSONB NOT NULL DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '{}'::jsonb,
  is_official BOOLEAN DEFAULT true,
  creator_id TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 结局表
CREATE TABLE endings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  culture_id UUID REFERENCES culture_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  achievement_level TEXT CHECK (achievement_level IN ('legendary', 'excellent', 'good', 'ordinary', 'poor')),
  is_official BOOLEAN DEFAULT true,
  creator_id TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户创作评价表
CREATE TABLE creation_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('culture', 'event', 'ending')),
  content_id UUID NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, content_id, user_id)
);

-- 游戏记录表（可选，用于统计）
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  culture_id UUID REFERENCES culture_templates(id),
  final_attributes JSONB,
  ending_id UUID REFERENCES endings(id),
  play_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_events_culture ON events(culture_id);
CREATE INDEX idx_events_stage ON events(stage);
CREATE INDEX idx_endings_culture ON endings(culture_id);
CREATE INDEX idx_ratings_content ON creation_ratings(content_type, content_id);

-- RLS策略
ALTER TABLE culture_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE endings ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- 所有人可以读取已批准的内容
CREATE POLICY "Anyone can read approved cultures" ON culture_templates FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can read approved events" ON events FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can read approved endings" ON endings FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can read ratings" ON creation_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ratings" ON creation_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert game sessions" ON game_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read game sessions" ON game_sessions FOR SELECT USING (true);