import React from 'react';

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showAvatar?: boolean;
  lines?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  showImage = true,
  showAvatar = false,
  lines = 3,
}) => {
  return (
    <div className={`animate-pulse bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {showImage && (
        <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-200 rounded-full h-10 w-10"></div>
            <div className="space-y-2 flex-1">
              <div className="bg-gray-200 rounded h-4 w-24"></div>
              <div className="bg-gray-200 rounded h-3 w-32"></div>
            </div>
          </div>
        )}
        
        <div className="bg-gray-200 rounded h-6 w-3/4"></div>
        
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`bg-gray-200 rounded h-4 ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
        
        <div className="flex space-x-2 pt-2">
          <div className="bg-gray-200 rounded h-8 w-16"></div>
          <div className="bg-gray-200 rounded h-8 w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;