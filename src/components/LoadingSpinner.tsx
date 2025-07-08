'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'white';
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'text-primary-dark',
    accent: 'text-primary-accent',
    white: 'text-white',
  };

  return (
    <div className='flex items-center justify-center'>
      <Loader2
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  );
}
