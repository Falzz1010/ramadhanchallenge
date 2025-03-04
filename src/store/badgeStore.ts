import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Badge {
  id: number;
  name: string;
  description: string;
  requirement: number;
  icon: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: number;
  earned_at: string;
}

interface BadgeStore {
  badges: Badge[];
  userBadges: UserBadge[];
  loading: boolean;
  error: string | null;
  fetchUserBadges: (userId: string) => Promise<void>;
  checkAndAwardBadges: (userId: string, completedCount: number) => Promise<void>;
}

const BADGES: Badge[] = [
  {
    id: 1,
    name: 'Pemula Ramadhan',
    description: 'Selesaikan 5 tantangan',
    requirement: 5,
    icon: '🌟'
  },
  {
    id: 2,
    name: 'Pejuang Ramadhan',
    description: 'Selesaikan 10 tantangan',
    requirement: 10,
    icon: '🏆'
  },
  {
    id: 3,
    name: 'Master Ramadhan',
    description: 'Selesaikan 15 tantangan',
    requirement: 15,
    icon: '👑'
  },
  {
    id: 4,
    name: 'Legenda Ramadhan',
    description: 'Selesaikan semua tantangan',
    requirement: 30,
    icon: '⭐'
  }
];

export const useBadgeStore = create<BadgeStore>((set, get) => ({
  badges: BADGES,
  userBadges: [],
  loading: false,
  error: null,

  fetchUserBadges: async (userId: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      console.log('Fetched user badges:', data);
      set({ userBadges: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching badges:', error);
      set({ loading: false, error: (error as Error).message });
    }
  },

  checkAndAwardBadges: async (userId: string, completedCount: number) => {
    try {
      console.log('Starting badge check:', {
        userId,
        completedCount
      });

      // Get current badges
      const { data: currentBadges, error: badgesError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);

      if (badgesError) throw badgesError;

      console.log('Current badges:', currentBadges);

      // Find badges to award
      const badgesToAward = BADGES.filter(badge => {
        const alreadyEarned = (currentBadges || []).some(
          ub => ub.badge_id === badge.id
        );
        const shouldAward = completedCount >= badge.requirement;

        console.log(`Checking "${badge.name}":`, {
          requirement: badge.requirement,
          completedCount,
          alreadyEarned,
          shouldAward
        });

        return !alreadyEarned && shouldAward;
      });

      if (badgesToAward.length === 0) {
        console.log('No badges to award');
        return;
      }

      console.log('Will award badges:', badgesToAward);

      // Award new badges
      const { data: newBadges, error: insertError } = await supabase
        .from('user_badges')
        .insert(
          badgesToAward.map(badge => ({
            user_id: userId,
            badge_id: badge.id,
            earned_at: new Date().toISOString()
          }))
        )
        .select();

      if (insertError) throw insertError;

      console.log('Successfully awarded badges:', newBadges);

      // Update local state
      set(state => ({
        userBadges: [...state.userBadges, ...(newBadges || [])]
      }));

      // Show notifications
      badgesToAward.forEach(badge => {
        alert(`🎉 Selamat! Anda mendapatkan badge "${badge.name}"!`);
      });

    } catch (error) {
      console.error('Error in checkAndAwardBadges:', error);
      throw error;
    }
  }
}));

export default useBadgeStore;


