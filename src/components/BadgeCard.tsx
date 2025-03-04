import React from 'react';
import { Badge } from '../types/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Info } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  earnedDate?: string | null;
  progress: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, earned, earnedDate, progress }) => {
  const progressPercentage = Math.min(
    Math.round((progress / badge.required_challenges) * 100), 
    100
  );
  
  // Fallback image sebagai SVG
  const fallbackImage = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%2322c55e' stroke-width='2'><circle cx='12' cy='8' r='7'/><polyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88'/></svg>`;
  
  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-lg shadow-soft overflow-hidden transition-all duration-300 ${
        earned ? 'border-2 border-yellow-400 dark:border-yellow-500 hover:shadow-lg transform hover:-translate-y-1' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex flex-col items-center">
          <div 
            className={`w-24 h-24 rounded-full mb-4 flex items-center justify-center transition-all duration-300 ${
              earned 
                ? 'bg-yellow-50 dark:bg-yellow-900/20 group-hover:scale-110' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <img 
              src={badge.image_url || fallbackImage} 
              alt={badge.name} 
              className={`w-16 h-16 ${!earned ? 'opacity-50 grayscale' : ''} object-contain transition-transform duration-300`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
              loading="lazy"
            />
          </div>
          
          <div className="relative group cursor-help">
            <h3 className="text-lg font-semibold text-center mb-1 text-gray-800 dark:text-gray-100 flex items-center gap-1">
              {badge.name}
              <Info className="w-4 h-4 text-gray-400" />
            </h3>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {badge.description}
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-3">{badge.description}</p>
          
          {!earned && (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {progress} / {badge.required_challenges} tantangan
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    progressPercentage === 100 
                      ? 'bg-green-500' 
                      : 'bg-primary-500'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {earned && (
            <div className="text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 mb-2">
                Diperoleh
              </span>
              {earnedDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(earnedDate), 'dd MMMM yyyy', { locale: id })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;