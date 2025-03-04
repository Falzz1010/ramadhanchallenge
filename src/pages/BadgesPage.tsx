import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBadgeStore } from '../store/badgeStore';
import { useChallengeStore } from '../store/challengeStore';
import BadgeCard from '../components/BadgeCard';
import { Award, Filter } from 'lucide-react';

const BadgesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { badges, userBadges, fetchUserBadges } = useBadgeStore();
  const { userChallenges } = useChallengeStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'earned' | 'unearned'>('all');

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        await fetchUserBadges(user.id);
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, fetchUserBadges]);

  const completedCount = userChallenges.filter(uc => uc.completed).length;
  const earnedBadgesCount = userBadges.length;

  const filteredBadges = badges.filter(badge => {
    const isEarned = userBadges.some(ub => ub.badge_id === badge.id);
    if (filter === 'earned') return isEarned;
    if (filter === 'unearned') return !isEarned;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Badge Collection
      </h1>
      
      <div className="grid gap-6">
        {badges.map(badge => {
          const earned = userBadges.some(ub => ub.badge_id === badge.id);
          const progress = Math.min((completedCount / badge.requirement) * 100, 100);
          
          return (
            <div 
              key={badge.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${
                earned ? 'border-2 border-primary-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-4xl">{badge.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {badge.name}
                    </h2>
                    {earned && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {badge.description}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {completedCount}/{badge.requirement}
                      </span>
                    </div>
                    
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          earned ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesPage;

