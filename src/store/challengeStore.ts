import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Challenge, UserChallenge } from '../types/types';
import { useBadgeStore } from '../store/badgeStore';

interface ChallengeState {
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  currentDay: number;
  isLoading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  fetchUserChallenges: (userId: string) => Promise<void>;
  completeChallenge: (userId: string, challengeId: number, notes?: string) => Promise<void>;
  uncompleteChallenge: (userId: string, challengeId: number) => Promise<void>;
  checkAndUpdateCurrentDay: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  userChallenges: [],
  currentDay: 1, // Default to day 1
  isLoading: false,
  error: null,

  checkAndUpdateCurrentDay: () => {
    const today = new Date();
    const newCurrentDay = today.getDate();
    if (newCurrentDay !== get().currentDay) {
      set({ currentDay: newCurrentDay });
    }
  },

  fetchChallenges: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current date and update currentDay
      const today = new Date();
      const currentDay = today.getDate();
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('day', { ascending: true });
        
      if (error) throw error;
      
      set({ 
        challenges: data as Challenge[], 
        currentDay,
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchUserChallenges: async (userId: string) => {
    try {
      const { data: completedChallenges, error: completedError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', userId);

      if (completedError) throw completedError;

      console.log('Fetched user challenges:', {
        userId,
        challenges: completedChallenges,
        count: completedChallenges?.length
      });

      set({ userChallenges: completedChallenges || [] });
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      throw error;
    }
  },

  completeChallenge: async (userId: string, challengeId: number, notes?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get the challenge to check its day
      const challenge = get().challenges.find(c => c.id === challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Check if the challenge is from a past day
      const currentDay = get().currentDay;
      if (challenge.day < currentDay) {
        throw new Error('Tantangan ini sudah tidak bisa diselesaikan karena sudah lewat waktunya');
      }
      
      // Check if the challenge is from a future day
      if (challenge.day > currentDay) {
        throw new Error('Tantangan ini belum bisa diselesaikan karena belum waktunya');
      }
      
      // Continue with existing completion logic
      const { data: existingData, error: existingError } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .single();
        
      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }
      
      const { error } = await supabase
        .from('user_challenges')
        .upsert({
          user_id: userId,
          challenge_id: challengeId,
          completed: true,
          completed_at: new Date().toISOString(),
          notes: notes || ''
        });
        
      if (error) throw error;
      
      // Refresh user challenges
      await get().fetchUserChallenges(userId);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error; // Re-throw to handle in UI
    } finally {
      set({ isLoading: false });
    }
  },

  uncompleteChallenge: async (userId: string, challengeId: number) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from('user_challenges')
        .upsert(
          {
            user_id: userId,
            challenge_id: challengeId,
            completed: false,
            completed_at: null,
            notes: null
          },
          {
            onConflict: 'user_id,challenge_id',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;

      // Refresh user challenges
      await get().fetchUserChallenges(userId);
    } catch (error) {
      console.error('Error uncompleting challenge:', error);
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));




