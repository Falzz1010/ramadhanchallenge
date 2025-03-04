import React from 'react';
import { UserChallenge, Challenge } from '../types/types';

interface ProgressChartProps {
  challenges: Challenge[];
  userChallenges: UserChallenge[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ challenges, userChallenges }) => {
  // Hitung total tantangan yang sudah selesai
  const completedCount = userChallenges.filter(uc => uc.completed).length;
  
  // Hitung total tantangan
  const totalChallenges = challenges.length;
  
  // Hitung persentase progress
  const progressPercentage = totalChallenges > 0 
    ? Math.round((completedCount / totalChallenges) * 100) 
    : 0;

  console.log('Progress calculation:', {
    completed: completedCount,
    total: totalChallenges,
    percentage: progressPercentage,
    userChallenges,
    challenges
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Progress Tantangan
      </h2>
      
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Progress stats */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {completedCount} dari {totalChallenges} tantangan selesai
          </span>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {progressPercentage}%
          </span>
        </div>
        
        {/* Detailed stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {completedCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tantangan Selesai
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {totalChallenges - completedCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tantangan Tersisa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
