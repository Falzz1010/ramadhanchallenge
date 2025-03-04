import React from 'react';

const CommentSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
