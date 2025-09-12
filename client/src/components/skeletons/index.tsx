// Skeleton components for loading states
export { default as SkeletonCard } from './SkeletonCard';
export { default as SkeletonTable } from './SkeletonTable';
export { default as SkeletonList } from './SkeletonList';
export { default as SkeletonText } from './SkeletonText';
export { default as SkeletonGrid } from './SkeletonGrid';

// Common skeleton patterns for specific use cases
import React from 'react';
import SkeletonCard from './SkeletonCard';
import SkeletonTable from './SkeletonTable';
import SkeletonList from './SkeletonList';
import SkeletonGrid from './SkeletonGrid';

// Memorial-specific skeletons
export const MemorialCardSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <SkeletonGrid
    items={count}
    columns={3}
    itemProps={{
      showImage: true,
      showAvatar: true,
      lines: 2,
    }}
  />
);

export const MemorialDetailSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6">
    {/* Header */}
    <div className="text-center space-y-4">
      <div className="bg-gray-200 rounded-full h-32 w-32 mx-auto"></div>
      <div className="bg-gray-200 rounded h-8 w-64 mx-auto"></div>
      <div className="bg-gray-200 rounded h-4 w-48 mx-auto"></div>
    </div>

    {/* Content sections */}
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="bg-gray-200 rounded h-6 w-32"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-4 w-full"></div>
          <div className="bg-gray-200 rounded h-4 w-5/6"></div>
          <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-200 rounded h-6 w-40"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-4 w-full"></div>
          <div className="bg-gray-200 rounded h-4 w-4/5"></div>
        </div>
      </div>
    </div>

    {/* Gallery */}
    <div className="space-y-4">
      <div className="bg-gray-200 rounded h-6 w-24"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg aspect-square"></div>
        ))}
      </div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6">
    {/* Stats cards */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="bg-gray-200 rounded h-4 w-24"></div>
              <div className="bg-gray-200 rounded h-8 w-16"></div>
            </div>
            <div className="bg-gray-200 rounded h-8 w-8"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Main content */}
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <SkeletonTable rows={5} columns={4} />
      </div>
      <div>
        <SkeletonList items={5} />
      </div>
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6">
    {/* Profile header */}
    <div className="flex items-center space-x-6">
      <div className="bg-gray-200 rounded-full h-24 w-24"></div>
      <div className="space-y-2 flex-1">
        <div className="bg-gray-200 rounded h-6 w-48"></div>
        <div className="bg-gray-200 rounded h-4 w-64"></div>
        <div className="bg-gray-200 rounded h-4 w-32"></div>
      </div>
      <div className="bg-gray-200 rounded h-10 w-24"></div>
    </div>

    {/* Profile sections */}
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="bg-gray-200 rounded h-6 w-40"></div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between">
              <div className="bg-gray-200 rounded h-4 w-24"></div>
              <div className="bg-gray-200 rounded h-4 w-32"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-200 rounded h-6 w-32"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 rounded h-4 w-full"></div>
          <div className="bg-gray-200 rounded h-4 w-5/6"></div>
          <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
);

// Form skeletons
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
  <div className="animate-pulse space-y-6">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="space-y-2">
        <div className="bg-gray-200 rounded h-4 w-24"></div>
        <div className="bg-gray-200 rounded h-10 w-full"></div>
      </div>
    ))}
    
    <div className="flex space-x-4 pt-4">
      <div className="bg-gray-200 rounded h-10 w-24"></div>
      <div className="bg-gray-200 rounded h-10 w-20"></div>
    </div>
  </div>
);