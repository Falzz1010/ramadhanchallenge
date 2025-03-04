export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  is_moderator?: boolean;
}

export interface Challenge {
  id: number;
  day: number;
  title: string;
  description: string;
  points: number;
  category: 'ibadah' | 'sedekah' | 'quran' | 'akhlak' | 'lainnya';
  userChallenge?: {
    completed: boolean;
    completed_at: string | null;
    notes?: string;
  };
  completion?: {
    completed: boolean;
    completed_at?: string;
    challenge_id?: string;
  } | null;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: number;
  completed: boolean;
  completed_at?: string;
  notes?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  image_url: string;
  required_challenges: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: number;
  earned_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  challenge_id?: number;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  user?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar_url?: string;
  points: number;
  completed_challenges: number;
}
