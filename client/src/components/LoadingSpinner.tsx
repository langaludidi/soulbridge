import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
  variant?: 'spinner' | 'pulse' | 'dots' | 'bars';
  color?: 'primary' | 'secondary' | 'accent';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message, 
  fullScreen = false,
  className = '',
  variant = 'spinner',
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <Loader2 className={`${sizeClasses[size]} animate-spin ${colorClasses[color]}`} />;
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse bg-current opacity-75`} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`${size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-4 w-4' : size === 'xl' ? 'h-5 w-5' : 'h-3 w-3'} ${colorClasses[color]} rounded-full animate-bounce bg-current`}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`${size === 'sm' ? 'h-6 w-1' : size === 'lg' ? 'h-12 w-2' : size === 'xl' ? 'h-16 w-3' : 'h-8 w-1'} ${colorClasses[color]} animate-pulse bg-current`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '0.8s',
                  animationIterationCount: 'infinite'
                }}
              />
            ))}
          </div>
        );
      
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin ${colorClasses[color]}`} />;
    }
  };

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {renderLoader()}
        {message && (
          <p className="text-sm text-muted-foreground text-center max-w-xs animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Enhanced loading component with progress
interface LoadingWithProgressProps {
  progress?: number;
  message?: string;
  className?: string;
}

export const LoadingWithProgress: React.FC<LoadingWithProgressProps> = ({
  progress = 0,
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center space-y-4 p-8 ${className}`}>
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{message}</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Inline loading component for buttons
interface InlineLoadingProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  size = 'sm',
  className = ''
}) => {
  return (
    <Loader2 className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} animate-spin ${className}`} />
  );
};

export default LoadingSpinner;