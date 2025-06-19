/*
  # Initial Schema for Creator Governance Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `role` (enum: user, creator, elected_creator, judge, admin)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `creators`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `description` (text)
      - `is_elected` (boolean)
      - `election_votes` (integer)
      - `term_start_date` (timestamp, optional)
      - `term_end_date` (timestamp, optional)
      - `created_at` (timestamp)

    - `content`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creators)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `tier_required` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `proposals`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references creators)
      - `title` (text)
      - `description` (text)
      - `proposal_type` (enum)
      - `status` (enum)
      - `votes_for` (integer)
      - `votes_against` (integer)
      - `voting_deadline` (timestamp)
      - `created_at` (timestamp)

    - `disputes`
      - `id` (uuid, primary key)
      - `plaintiff_id` (uuid, references profiles)
      - `defendant_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `status` (enum)
      - `assigned_judge_id` (uuid, references profiles, optional)
      - `resolution` (text, optional)
      - `created_at` (timestamp)
      - `resolved_at` (timestamp, optional)

    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `proposal_id` (uuid, references proposals)
      - `vote_type` (enum: for, against)
      - `created_at` (timestamp)

    - `elections`
      - `id` (uuid, primary key)
      - `candidate_id` (uuid, references creators)
      - `voter_id` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for different user roles
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'creator', 'elected_creator', 'judge', 'admin');
CREATE TYPE proposal_type AS ENUM ('platform_policy', 'revenue_sharing', 'creator_rights', 'other');
CREATE TYPE proposal_status AS ENUM ('draft', 'voting', 'passed', 'rejected', 'implemented');
CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'resolved', 'dismissed');
CREATE TYPE vote_type AS ENUM ('for', 'against');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role user_role DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  description text DEFAULT '',
  is_elected boolean DEFAULT false,
  election_votes integer DEFAULT 0,
  term_start_date timestamptz,
  term_end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  content text NOT NULL,
  tier_required text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  proposal_type proposal_type DEFAULT 'other',
  status proposal_status DEFAULT 'draft',
  votes_for integer DEFAULT 0,
  votes_against integer DEFAULT 0,
  voting_deadline timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plaintiff_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  defendant_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status dispute_status DEFAULT 'open',
  assigned_judge_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  resolution text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  vote_type vote_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, proposal_id)
);

-- Elections table
CREATE TABLE IF NOT EXISTS elections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
  voter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, voter_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for creators
CREATE POLICY "Anyone can read creators"
  ON creators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create creator profile"
  ON creators
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update own profile"
  ON creators
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for content
CREATE POLICY "Anyone can read content"
  ON content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage own content"
  ON content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM creators
      WHERE creators.id = content.creator_id
      AND creators.user_id = auth.uid()
    )
  );

-- Policies for proposals
CREATE POLICY "Anyone can read proposals"
  ON proposals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Elected creators can manage proposals"
  ON proposals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('elected_creator', 'admin')
    )
  );

-- Policies for disputes
CREATE POLICY "Users can read disputes they're involved in"
  ON disputes
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = plaintiff_id 
    OR auth.uid() = defendant_id 
    OR auth.uid() = assigned_judge_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('judge', 'admin')
    )
  );

CREATE POLICY "Users can create disputes"
  ON disputes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = plaintiff_id);

CREATE POLICY "Judges can update disputes"
  ON disputes
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_judge_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('judge', 'admin')
    )
  );

-- Policies for votes
CREATE POLICY "Users can read all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for elections
CREATE POLICY "Anyone can read elections"
  ON elections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can vote in elections"
  ON elections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = voter_id);

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, username, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();