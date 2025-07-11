import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {showSidebar && (
          <motion.aside
            className="hidden lg:block w-80 bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-sm border-r border-neutral-200/50 dark:border-neutral-700/50"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Sidebar />
          </motion.aside>
        )}
        <motion.main
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.main>
      </div>
      <Footer />
    </div>
  );
};