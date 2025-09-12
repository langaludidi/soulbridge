import React from 'react';

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  variant?: 'paragraph' | 'heading' | 'caption';
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  variant = 'paragraph',
}) => {
  const getHeightClass = () => {
    switch (variant) {
      case 'heading':
        return 'h-6';
      case 'caption':
        return 'h-3';
      default:
        return 'h-4';
    }
  };

  const getWidthVariation = (index: number) => {
    const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
    return widths[index % widths.length];
  };

  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded ${getHeightClass()} ${
            index === lines - 1 ? 'w-2/3' : getWidthVariation(index)
          }`}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonText;