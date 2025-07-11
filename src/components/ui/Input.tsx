import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'underlined';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className,
  type,
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseStyles = 'w-full transition-all duration-200 focus:outline-none';
  
  const variants = {
    default: cn(
      'px-4 py-3 bg-surface dark:bg-surface-dark border border-neutral-200 dark:border-neutral-700 rounded-xl',
      'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
      'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
      error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
    ),
    filled: cn(
      'px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-0 rounded-xl',
      'focus:bg-surface dark:focus:bg-surface-dark focus:ring-2 focus:ring-primary-500/20',
      'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
      error && 'bg-error-50 dark:bg-error-950/30 focus:ring-error-500/20'
    ),
    underlined: cn(
      'px-0 py-3 bg-transparent border-0 border-b-2 border-neutral-200 dark:border-neutral-700 rounded-none',
      'focus:border-primary-500',
      'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
      error && 'border-error-500 focus:border-error-500'
    ),
  };

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            isFocused ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-700 dark:text-neutral-300',
            error && 'text-error-600 dark:text-error-400'
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
            {icon}
          </div>
        )}
        
        <motion.input
          id={inputId}
          type={inputType}
          className={cn(
            baseStyles,
            variants[variant],
            icon && iconPosition === 'left' && 'pl-10',
            (icon && iconPosition === 'right') || isPassword ? 'pr-10' : '',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && !isPassword && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
            {icon}
          </div>
        )}
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-error-600 dark:text-error-400 flex items-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
      
      {helpText && !error && (
        <motion.p
          className="text-sm text-neutral-500 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {helpText}
        </motion.p>
      )}
    </div>
  );
};