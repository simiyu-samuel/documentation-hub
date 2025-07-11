import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'neutral';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  text,
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const variants = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    neutral: 'text-neutral-600',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      <motion.div
        className={cn('relative', sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className={cn('absolute inset-0 rounded-full border-2 border-transparent', variants[variant])}>
          <div className="absolute inset-0 rounded-full border-2 border-current opacity-25" />
          <div className="absolute inset-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
        </div>
      </motion.div>
      
      {text && (
        <motion.p
          className="text-sm text-neutral-600 dark:text-neutral-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string; lines?: number }> = ({
  className,
  lines = 1,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
};

export const LoadingCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('bg-surface dark:bg-surface-dark rounded-xl p-6 shadow-soft', className)}>
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-16" />
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
};