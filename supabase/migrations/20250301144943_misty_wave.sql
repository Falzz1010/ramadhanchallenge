/*
  # Initial Schema for Ramadhan Challenge App

  1. New Tables
    - `profiles` - User profiles
    - `challenges` - Daily challenges
    - `user_challenges` - User's completed challenges
    - `badges` - Achievement badges
    - `user_badges` - User's earned badges
    - `posts` - Community posts
    - `comments` - Comments on posts
    - `leaderboard` - View for leaderboard rankings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id serial PRIMARY KEY,
  day integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL DEFAULT 10,
  category text NOT NULL DEFAULT 'ibadah',
  created_at timestamptz DEFAULT now()
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id integer REFERENCES challenges(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  required_challenges integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id integer REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  challenge_id integer REFERENCES challenges(id) ON DELETE SET NULL,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id,
  p.name,
  p.avatar_url,
  COUNT(DISTINCT uc.challenge_id) as completed_challenges,
  COALESCE(SUM(c.points), 0) as points
FROM 
  profiles p
LEFT JOIN 
  user_challenges uc ON p.id = uc.user_id AND uc.completed = true
LEFT JOIN 
  challenges c ON uc.challenge_id = c.id
GROUP BY 
  p.id, p.name, p.avatar_url
ORDER BY 
  points DESC, completed_challenges DESC;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone" 
ON challenges FOR SELECT USING (true);

-- User challenges policies
CREATE POLICY "User challenges are viewable by everyone" 
ON user_challenges FOR SELECT USING (true);

CREATE POLICY "Users can insert own challenges" 
ON user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" 
ON user_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Badges are viewable by everyone" 
ON badges FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone" 
ON user_badges FOR SELECT USING (true);

CREATE POLICY "Users can insert own badges" 
ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" 
ON posts FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts" 
ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" 
ON posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" 
ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON comments FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" 
ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE USING (auth.uid() = user_id);