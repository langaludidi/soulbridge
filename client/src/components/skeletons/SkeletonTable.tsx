import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  showHeader = true,
}) => {
  return (
    <div className={`animate-pulse bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded h-5 w-20"
              ></div>
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className={`bg-gray-200 rounded h-4 ${
                    colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-16' : 'w-24'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;