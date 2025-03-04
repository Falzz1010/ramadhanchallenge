import React, { useEffect, useState, useMemo } from 'react';
import { useChallengeStore } from '../store/challengeStore';
import { useAuthStore } from '../store/authStore';
import ChallengeCard from '../components/ChallengeCard';
import { Lock } from 'lucide-react';
import { getCurrentDay } from '../utils/dateUtils';
import { Challenge, UserChallenge } from '../types/types';
import ProgressChart from '../components/ProgressChart';

const ChallengesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    challenges, 
    userChallenges, 
    currentDay, 
    fetchChallenges, 
    fetchUserChallenges,
    checkAndUpdateCurrentDay 
  } = useChallengeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  
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
        await Promise.all([
          fetchChallenges(),
          fetchUserChallenges(user.id)
        ]);
      } catch (error) {
        console.error('Error loading challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);
  
  // Add debug logging for challenges data
  useEffect(() => {
    if (challenges.length > 0) {
      console.log('Challenges loaded:', challenges);
      console.log('First challenge userChallenge:', challenges[0].userChallenge);
    }
  }, [challenges]);

  // Calculate total points from completed challenges
  useEffect(() => {
    const calculateTotalPoints = () => {
      const points = userChallenges
        .filter(uc => uc.completed)
        .reduce((total, uc) => {
          const challenge = challenges.find(c => c.id === uc.challenge_id);
          return total + (challenge?.points || 0);
        }, 0);

      console.log('Points calculation:', {
        completedChallenges: userChallenges.filter(uc => uc.completed),
        totalPoints: points
      });

      setTotalPoints(points);
    };

    calculateTotalPoints();
  }, [challenges, userChallenges]);

  // Calculate progress
  const completedCount = userChallenges.filter(uc => uc.completed).length;
  const totalChallenges = challenges.length;
  const progressPercentage = totalChallenges > 0 
    ? Math.round((completedCount / totalChallenges) * 100) 
    : 0;

  console.log('Challenges page progress:', {
    completed: completedCount,
    total: totalChallenges,
    percentage: progressPercentage
  });

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'ibadah', label: 'Ibadah' },
    { id: 'sedekah', label: 'Sedekah' },
    { id: 'quran', label: 'Al-Quran' },
    { id: 'akhlak', label: 'Akhlak' },
  ];

  // Helper function to calculate points based on day
  const calculatePoints = (day: number) => {
    if (day <= 10) return 10;
    if (day <= 15) return 15;
    return 20;
  };

  // Calculate completed challenges - FIXED
  const completedChallenges = useMemo(() => {
    return challenges.filter(challenge => 
      // Periksa apakah challenge benar-benar selesai
      challenge.userChallenge?.completed || 
      (challenge.completion && challenge.completion.completed === true)
    );
  }, [challenges]);

  // Memoize the renderChallenge function
  const renderChallenge = React.useCallback((challenge: Challenge) => {
    const isLocked = challenge.day > currentDay;
    const userChallenge = challenge.userChallenge;
    
    // Add debug logging for individual challenge rendering
    console.log(`Rendering challenge ${challenge.id}:`, {
      day: challenge.day,
      currentDay,
      isLocked,
      userChallenge
    });

    return (
      <div key={challenge.day} className="relative">
        <ChallengeCard
          challenge={challenge}
          day={challenge.day}
          isLocked={isLocked}
          userChallenge={userChallenge}
        />
        {isLocked && (
          <div className="absolute inset-0 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-[1px] rounded-lg flex flex-col items-center justify-center z-10">
            <Lock className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Misi Terkunci
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Terbuka pada Hari {challenge.day}
            </p>
          </div>
        )}
      </div>
    );
  }, [currentDay]);

  // Memoize filtered challenges
  const filteredChallenges = React.useMemo(() => {
    return challenges.filter(challenge => {
      const matchesCategory = selectedCategory === 'all' || challenge.category === selectedCategory;
      const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [challenges, selectedCategory, searchQuery]);

  // Separate filtered challenges into available and upcoming
  const filteredAvailableChallenges = filteredChallenges.filter(c => c.day <= currentDay);
  const filteredUpcomingChallenges = filteredChallenges.filter(c => c.day > currentDay);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tantangan Ramadhan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hari ke-{currentDay} dari 30 hari tantangan untuk meningkatkan ibadah dan amal kebaikan
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari tantangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 dark:bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Total Poin
            </h3>
            <p className="mt-2 text-3xl font-bold text-primary-600 dark:text-primary-400">
              {totalPoints}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Tantangan Selesai
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {completedCount} / {totalChallenges}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Progress
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {progressPercentage}%
            </p>
          </div>
        </div>

        {/* Available Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Tantangan Tersedia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableChallenges.map(challenge => {
              const userChallenge = userChallenges.find(
                uc => String(uc.challenge_id) === String(challenge.id)
              );
              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  userChallenge={userChallenge}
                  currentDay={currentDay}
                  isLocked={false}
                />
              );
            })}
          </div>
        </div>

        {/* Upcoming Challenges */}
        {filteredUpcomingChallenges.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Tantangan Mendatang
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcomingChallenges.map(challenge => (
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

        {/* No Results Message */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Tidak ada tantangan yang sesuai dengan filter
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
              Coba ubah kategori atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;




