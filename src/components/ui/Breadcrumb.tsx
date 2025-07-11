import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <motion.li
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to="/"
            className="breadcrumb-item flex items-center"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </motion.li>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li className="breadcrumb-separator">
              <ChevronRight className="h-4 w-4" />
            </li>
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: (index + 1) * 0.05 }}
            >
              {item.href && !item.current ? (
                <Link
                  to={item.href}
                  className="breadcrumb-item font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
                    item.current
                      ? 'text-primary-600 dark:text-primary-400 font-semibold'
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </motion.li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};