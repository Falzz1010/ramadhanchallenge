import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChallengeStore } from '../store/challengeStore';
import { useBadgeStore } from '../store/badgeStore';
import ChallengeCard from '../components/ChallengeCard';
import ProgressChart from '../components/ProgressChart';
import LeaderboardCard from '../components/LeaderboardCard';
import { supabase } from '../lib/supabase';
import { Challenge } from '../types/types';
import BadgeDisplay from '../components/BadgeDisplay';
 
interface LeaderboardUser {
  id: string;
  name: string;
  avatar_url?: string;
  points: number;
  completed_challenges: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    challenges, 
    userChallenges, 
    currentDay, 
    fetchChallenges, 
    fetchUserChallenges,
    checkAndUpdateCurrentDay 
  } = useChallengeStore();
  const { checkAndAwardBadges, badges, userBadges, fetchUserBadges } = useBadgeStore();
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Move calculatePoints function before useMemo
  const calculatePoints = (day: number) => {
    if (day <= 10) return 10;
    if (day <= 15) return 15;
    return 20;
  };

  // Get challenges by status
  const availableChallenges = challenges.filter(c => c.day <= currentDay);
  const upcomingChallenges = challenges.filter(c => c.day > currentDay);
  const todayChallenge = challenges.find(c => c.day === currentDay);
  
  // Get user progress for today's challenge
  const todayUserChallenge = userChallenges.find(
    uc => todayChallenge && String(uc.challenge_id) === String(todayChallenge.id)
  );

  // Get recent completed challenges
  const recentCompletedChallenges = userChallenges
    .filter(uc => uc.completed)
    .sort((a, b) => {
      if (!a.completed_at || !b.completed_at) return 0;
      return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
    })
    .slice(0, 3)
    .map(uc => {
      const challenge = challenges.find(c => String(c.id) === String(uc.challenge_id));
      return { userChallenge: uc, challenge };
    })
    .filter(item => item.challenge);

  const fetchLeaderboard = async () => {
    try {
      // Fetch all user challenges first
      const { data: userChallengesData, error: challengesError } = await supabase
        .from('user_challenges')
        .select('user_id, completed, completed_at')
        .eq('completed', true);

      if (challengesError) throw challengesError;

      console.log('User Challenges Data:', userChallengesData);

      // Count completed challenges per user
      const userCompletions = userChallengesData.reduce((acc, curr) => {
        acc[curr.user_id] = (acc[curr.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('User Completions:', userCompletions);

      // Fetch user profiles with names
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .neq('name', '') // Exclude empty names
        .not('name', 'is', null); // Exclude null names

      if (profilesError) throw profilesError;

      console.log('Profiles Data:', profilesData);

      // Combine the data and ensure names exist
      const leaderboardData = (profilesData || [])
        // Filter out profiles without names or with empty names
        .filter(profile => {
          const hasValidName = profile.name && 
                             profile.name.trim() !== '' && 
                             profile.name.toLowerCase() !== 'anonymous' &&
                             profile.name.toLowerCase() !== 'anon';
          console.log(`Profile ${profile.id}: Name "${profile.name}" is valid: ${hasValidName}`);
          return hasValidName;
        })
        // Map to leaderboard entries
        .map(profile => {
          const completedCount = userCompletions[profile.id] || 0;
          return {
            id: profile.id,
            name: profile.name,
            avatar_url: profile.avatar_url,
            points: completedCount * 10, // 10 points per completed challenge
            completed_challenges: completedCount
          };
        })
        // Only include users who have completed challenges
        .filter(user => user.completed_challenges > 0);

      console.log('Processed Leaderboard Data:', leaderboardData);

      // Sort by points and take top 10
      const sortedLeaderboard = leaderboardData
        .sort((a, b) => {
          // Sort by points first
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          // If points are equal, sort by name
          return a.name.localeCompare(b.name);
        })
        .slice(0, 10);

      console.log('Final Sorted Leaderboard:', sortedLeaderboard);

      setLeaderboardUsers(sortedLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    // Check day change every minute
    const dayCheckInterval = setInterval(() => {
      checkAndUpdateCurrentDay();
    }, 60000); // Check every minute

    return () => clearInterval(dayCheckInterval);
  }, [checkAndUpdateCurrentDay]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Load all necessary data
        await Promise.all([
          fetchChallenges(),
          fetchUserChallenges(user.id),
          fetchUserBadges(user.id)
        ]);

        // Get completed challenges count
        const { data: completedData } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true);

        console.log('Progress data:', {
          challenges: challenges.length,
          userChallenges: userChallenges.length,
          completed: completedData?.length || 0
        });

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);
  
  // Add real-time subscription for leaderboard updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('leaderboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'user_challenges'
        },
        () => {
          fetchLeaderboard(); // Refresh leaderboard when changes occur
        }
      )
      .subscribe();

    // Initial fetch
    fetchLeaderboard();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          {/* Loading skeleton */}
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  const completedCount = userChallenges.filter(uc => uc.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Assalamu'alaikum, {user?.name || 'Sobat Ramadhan'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Selamat datang di Ramadhan Challenge. Hari ini adalah hari ke-{currentDay} Ramadhan.
          </p>
        </div>
        <button
          onClick={() => setShowTutorial(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          Tutorial
        </button>
      </div>
      
      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Tutorial Ramadhan Challenge
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                  1. Tantangan Harian
                </h3>
                <p>Setiap hari ada tantangan baru yang bisa kamu selesaikan. Tantangan ini dirancang untuk meningkatkan ibadah selama Ramadhan.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                  2. Points & Ranking
                </h3>
                <p>Setiap tantangan yang diselesaikan akan memberikan 10 points. Kumpulkan points sebanyak mungkin untuk naik ranking di leaderboard.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                  3. Badge
                </h3>
                <p>Dapatkan badge spesial dengan menyelesaikan tantangan-tantangan tertentu. Badge menunjukkan pencapaianmu dalam perjalanan Ramadhan.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                  4. Progress
                </h3>
                <p>Pantau progressmu melalui grafik dan statistik yang tersedia. Lihat berapa banyak tantangan yang sudah kamu selesaikan.</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowTutorial(false)}
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Today's challenge */}
          {todayChallenge && (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Tantangan Hari Ini
              </h2>
              <ChallengeCard 
                challenge={todayChallenge}
                userChallenge={todayUserChallenge}
                currentDay={currentDay}
              />
            </div>
          )}

          {/* Available challenges */}
          {availableChallenges.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Tantangan Tersedia
              </h2>
              <div className="space-y-4">
                {availableChallenges.map(challenge => {
                  const userChallenge = userChallenges.find(
                    uc => String(uc.challenge_id) === String(challenge.id)
                  );
                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userChallenge={userChallenge}
                      currentDay={currentDay}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming challenges */}
          {upcomingChallenges.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                Tantangan Mendatang
              </h2>
              <div className="space-y-4">
                {upcomingChallenges.slice(0, 3).map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentDay={currentDay}
                    isLocked={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Progress chart */}
          <ProgressChart 
            challenges={challenges}
            userChallenges={userChallenges}
          />
          
          <BadgeDisplay completedCount={completedCount} />
          
          {/* Leaderboard */}
          <LeaderboardCard 
            users={leaderboardUsers}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
