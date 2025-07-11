import React from 'react';
import { useAppSettings } from '../../hooks/useAppSettings';

export const Footer: React.FC = () => {
  const { settings } = useAppSettings();

  return (
    <footer className="bg-surface dark:bg-neutral-dark border-t border-neutral-light dark:border-neutral-dark/60 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {settings?.footer_text || 'Built with love for great documentation'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()} {settings?.site_name || 'Documentation Hub'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};