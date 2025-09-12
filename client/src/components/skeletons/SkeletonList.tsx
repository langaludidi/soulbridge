import React from 'react';

interface SkeletonListProps {
  items?: number;
  className?: string;
  showAvatar?: boolean;
  showActions?: boolean;
}

const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  className = '',
  showAvatar = true,
  showActions = true,
}) => {
  return (
    <div className={`animate-pulse bg-white rounded-lg shadow-sm border divide-y divide-gray-100 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {showAvatar && (
                <div className="bg-gray-200 rounded-full h-10 w-10 flex-shrink-0"></div>
              )}
              
              <div className="space-y-2 flex-1">
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                <div className="bg-gray-200 rounded h-3 w-1/2"></div>
              </div>
            </div>
            
            {showActions && (
              <div className="flex space-x-2">
                <div className="bg-gray-200 rounded h-8 w-16"></div>
                <div className="bg-gray-200 rounded h-8 w-12"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonList;