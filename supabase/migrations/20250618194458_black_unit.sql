/*
  # Enhanced Content Management System

  1. New Tables
    - `content_types` - Define different content types (video, audio, live_stream, etc.)
    - `subscription_tiers` - Creator subscription tiers with pricing
    - `subscriptions` - User subscriptions to creators
    - `live_streams` - Live streaming sessions
    - `content_access` - Track content access permissions
    - `creator_earnings` - Track creator revenue
    - `platform_settings` - Platform-wide configuration

  2. Enhanced Tables
    - Update `content` table with more fields
    - Add content scheduling and tier restrictions

  3. Security
    - RLS policies for subscription-based content access
    - Creator earnings privacy
*/

-- Content types enum
CREATE TYPE content_type AS ENUM (
  'text_post', 'image', 'video', 'audio', 'live_stream', 
  'digital_download', 'poll', 'discussion', 'article'
);

-- Subscription tier types
CREATE TYPE tier_type AS ENUM ('free', 'supporter', 'premium', 'vip');

-- Stream status
CREATE TYPE stream_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');

-- Content types table
CREATE TABLE IF NOT EXISTS content_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Subscription tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price_monthly decimal(10,2) NOT NULL DEFAULT 0,
  tier_type tier_type NOT NULL,
  benefits text[],
  max_subscribers integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, creator_id)
);

-- Live streams table
CREATE TABLE IF NOT EXISTS live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_start timestamptz NOT NULL,
  actual_start timestamptz,
  ended_at timestamptz,
  status stream_status DEFAULT 'scheduled',
  tier_required tier_type DEFAULT 'free',
  max_viewers integer,
  current_viewers integer DEFAULT 0,
  stream_key text,
  recording_url text,
  created_at timestamptz DEFAULT now()
);

-- Enhanced content table (drop and recreate with new structure)
DROP TABLE IF EXISTS content CASCADE;
CREATE TABLE content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  content_type content_type DEFAULT 'text_post',
  content_data jsonb DEFAULT '{}',
  tier_required tier_type DEFAULT 'free',
  is_published boolean DEFAULT false,
  scheduled_publish_at timestamptz,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content access tracking
CREATE TABLE IF NOT EXISTS content_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  accessed_at timestamptz DEFAULT now(),
  access_duration interval,
  UNIQUE(user_id, content_id)
);

-- Creator earnings tracking
CREATE TABLE IF NOT EXISTS creator_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  transaction_type text NOT NULL, -- 'subscription', 'tip', 'commission'
  platform_fee decimal(10,2) DEFAULT 0,
  net_amount decimal(10,2) NOT NULL,
  processed_at timestamptz DEFAULT now(),
  payout_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Platform settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Comments system
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  is_pinned boolean DEFAULT false,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content likes
CREATE TABLE IF NOT EXISTS content_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Content types (public read)
CREATE POLICY "Anyone can read content types"
  ON content_types FOR SELECT
  TO authenticated USING (true);

-- Subscription tiers
CREATE POLICY "Anyone can read subscription tiers"
  ON subscription_tiers FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Creators can manage their tiers"
  ON subscription_tiers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = subscription_tiers.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Subscriptions
CREATE POLICY "Users can read their subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can see their subscribers"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = subscriptions.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Live streams
CREATE POLICY "Anyone can read live streams"
  ON live_streams FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Creators can manage their streams"
  ON live_streams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = live_streams.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Content (enhanced)
CREATE POLICY "Anyone can read published content"
  ON content FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Creators can manage their content"
  ON content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = content.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Content access
CREATE POLICY "Users can read their access history"
  ON content_access FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create access records"
  ON content_access FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Creator earnings (private to creator)
CREATE POLICY "Creators can read their earnings"
  ON creator_earnings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = creator_earnings.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Platform settings (admin only)
CREATE POLICY "Admins can manage platform settings"
  ON platform_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comments
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Content likes
CREATE POLICY "Anyone can read likes"
  ON content_likes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can manage their likes"
  ON content_likes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default content types
INSERT INTO content_types (name, description, icon) VALUES
  ('Text Post', 'Written content and updates', 'FileText'),
  ('Image', 'Photos and visual content', 'Image'),
  ('Video', 'Video content and tutorials', 'Video'),
  ('Audio', 'Podcasts and audio content', 'Headphones'),
  ('Live Stream', 'Real-time streaming content', 'Radio'),
  ('Digital Download', 'Downloadable files and resources', 'Download'),
  ('Poll', 'Community polls and surveys', 'BarChart'),
  ('Discussion', 'Community discussions', 'MessageCircle'),
  ('Article', 'Long-form written content', 'BookOpen');

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description) VALUES
  ('platform_fee_percentage', '10', 'Platform fee percentage for transactions'),
  ('min_payout_amount', '50', 'Minimum amount for creator payouts'),
  ('max_subscription_price', '1000', 'Maximum monthly subscription price'),
  ('live_stream_enabled', 'true', 'Enable live streaming features'),
  ('content_moderation_enabled', 'true', 'Enable content moderation');

-- Functions for updating counters
CREATE OR REPLACE FUNCTION update_content_like_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE content SET like_count = like_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE content SET like_count = like_count - 1 WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_content_comment_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE content SET comment_count = comment_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE content SET comment_count = comment_count - 1 WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for counters
CREATE TRIGGER content_like_count_trigger
  AFTER INSERT OR DELETE ON content_likes
  FOR EACH ROW EXECUTE FUNCTION update_content_like_count();

CREATE TRIGGER content_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_content_comment_count();

-- Triggers for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON subscription_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();