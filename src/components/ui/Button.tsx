import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-medium hover:shadow-large focus:ring-primary-500/20 transform hover:scale-105',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-medium hover:shadow-large focus:ring-secondary-500/20 transform hover:scale-105',
    outline: 'border-2 border-neutral-300 dark:border-neutral-600 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-primary-500 hover:text-primary-600 focus:ring-primary-500/20',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 focus:ring-primary-500/20',
    danger: 'bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-medium hover:shadow-large focus:ring-error-500/20 transform hover:scale-105',
    success: 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-medium hover:shadow-large focus:ring-success-500/20 transform hover:scale-105',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  return (
    <motion.button
      whileHover={{ scale: variant === 'ghost' || variant === 'outline' ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect for primary and secondary buttons */}
      {(variant === 'primary' || variant === 'secondary') && (
        <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse" />
      )}
      
      {loading && (
        <svg className={cn('animate-spin mr-2', iconSizes[size])} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={cn('mr-2', iconSizes[size])}>{icon}</span>
      )}
      
      <span className="relative z-10">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={cn('ml-2', iconSizes[size])}>{icon}</span>
      )}
    </motion.button>
  );
};