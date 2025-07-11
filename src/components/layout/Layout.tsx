import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex justify-center items-start py-8">
        {showSidebar && <Sidebar />}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-10 rounded-2xl bg-surface shadow-card border border-neutral/10" style={{minHeight: '80vh'}}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};