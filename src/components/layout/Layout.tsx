import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex flex-col">
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar for desktop */}
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
        {/* Sidebar for mobile/tablet */}
        {showSidebar && (
          <motion.div
            className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none opacity-0'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              className="absolute left-0 top-0 h-full w-72 bg-surface dark:bg-surface-dark shadow-xl p-0"
              initial={{ x: -320 }}
              animate={{ x: sidebarOpen ? 0 : -320 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <Sidebar />
            </motion.aside>
          </motion.div>
        )}
        <motion.main
          className="flex-1 overflow-x-auto w-full"
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