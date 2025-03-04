import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types/types';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  isLoginAllowed: boolean;
  setUser: (user: User | null) => void;
  setLoginAllowed: (allowed: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      isLoginAllowed: false,

      signInWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const redirectUrl = `${window.location.origin}/dashboard`;
          console.log('Starting Google sign in, redirect URL:', redirectUrl);
          
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });
          
          if (error) throw error;
          
        } catch (error) {
          console.error('Sign in error:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      getUser: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (session?.user) {
            const { data, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              throw profileError;
            }
            
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: data?.name || session.user.user_metadata.full_name,
              avatar_url: data?.avatar_url || session.user.user_metadata.avatar_url,
              bio: data?.bio || '',
              social_links: data?.social_links || {}
            };
            
            set({ user });
          }
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (profile: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
          if (authError) throw authError;
          
          if (!authUser) throw new Error('No user found');
          
          // Update the profile in the profiles table
          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: authUser.id,
              name: profile.name,
              avatar_url: profile.avatar_url,
              bio: profile.bio,
              social_links: profile.social_links,
              updated_at: new Date().toISOString()
            });
            
          if (updateError) throw updateError;
          
          // Update local state
          set((state) => ({
            user: state.user ? {
              ...state.user,
              ...profile
            } : null
          }));
          
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setUser: (user) => set({ user }),
      setLoginAllowed: (allowed) => set({ isLoginAllowed: allowed }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoginAllowed: state.isLoginAllowed,
        user: state.user,
      }),
    }
  )
);
