import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  return (
    <Layout showSidebar={false}>
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-neutral-dark">
        <div className="text-center bg-surface dark:bg-neutral-dark rounded-2xl shadow-lg p-12">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">403</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">
            You don't have permission to access this page.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};