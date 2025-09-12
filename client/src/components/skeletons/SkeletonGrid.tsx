import React from 'react';
import SkeletonCard from './SkeletonCard';

interface SkeletonGridProps {
  items?: number;
  columns?: number;
  className?: string;
  itemProps?: {
    showImage?: boolean;
    showAvatar?: boolean;
    lines?: number;
  };
}

const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  items = 6,
  columns = 3,
  className = '',
  itemProps = {},
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  } as const;

  const gridClass = gridCols[columns as keyof typeof gridCols] || gridCols[3];

  return (
    <div className={`grid gap-6 ${gridClass} ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard
          key={index}
          showImage={itemProps.showImage}
          showAvatar={itemProps.showAvatar}
          lines={itemProps.lines}
        />
      ))}
    </div>
  );
};

export default SkeletonGrid;