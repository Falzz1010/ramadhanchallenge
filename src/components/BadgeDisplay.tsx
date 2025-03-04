import { useBadgeStore } from '../store/badgeStore';
import { useChallengeStore } from '../store/challengeStore';

const BadgeDisplay = () => {
  const { badges, userBadges } = useBadgeStore();
  const { userChallenges } = useChallengeStore();
  
  const completedCount = userChallenges.filter(uc => uc.completed).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Progress Badge
      </h2>
      <div className="space-y-6">
        {badges.map(badge => {
          const earned = userBadges.some(ub => ub.badge_id === badge.id);
          const progress = Math.min((completedCount / badge.requirement) * 100, 100);
          
          return (
            <div key={badge.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {badge.name}
                      {earned && (
                        <span className="ml-2 text-green-500">✓</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {badge.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {completedCount}/{badge.requirement}
                  </span>
                </div>
              </div>
              
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-500 rounded-full ${
                    earned ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeDisplay;

