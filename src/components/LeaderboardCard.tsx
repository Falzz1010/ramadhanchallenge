import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_url?: string;
  points: number;
  completed_challenges: number;
}

interface LeaderboardCardProps {
  users: LeaderboardEntry[];
  loading: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ users = [], loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Papan Peringkat
        </h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Papan Peringkat
      </h2>
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Belum ada data peringkat
          </p>
        ) : (
          users.map((user, index) => (
            <div 
              key={user.id} 
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Ranking badge */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-primary-700 dark:text-primary-300 font-bold">
                  {index + 1}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.points} poin • {user.completed_challenges} tantangan
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardCard;





