import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Settings, Users } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { DocumentCard } from '../components/docs/DocumentCard';
import { useDocuments } from '../hooks/useDocuments';
import { useAppSettings } from '../hooks/useAppSettings';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  const { documents: featuredDocs } = useDocuments({ status: 'published', limit: 6 });
  const { settings } = useAppSettings();

  const features = [
    {
      icon: FileText,
      title: 'Rich Documentation',
      description: 'Write and organize your documentation with Markdown support and rich formatting.',
      color: 'text-secondary-600 dark:text-secondary-400',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find what you need quickly with full-text search across all your documents.',
      color: 'text-accent-600 dark:text-accent-400',
    },
    {
      icon: Settings,
      title: 'Easy Management',
      description: 'Manage categories, tags, and settings with an intuitive admin interface.',
      color: 'text-primary-600 dark:text-primary-400',
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      description: 'Control access with user roles and permissions for secure documentation.',
      color: 'text-success-600 dark:text-success-400',
    },
  ];

  return (
    <Layout showSidebar={false}>
      <div className="bg-background">
        {/* Hero Section */}
        <div className="w-full flex items-center justify-center py-20">
          <div className="max-w-2xl w-full bg-surface rounded-2xl shadow-card px-8 py-16 text-center flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6">
              {settings?.site_name || 'Documentation Hub'}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl md:text-2xl text-neutral font-medium mb-8">
              {settings?.site_description || 'Your comprehensive documentation platform'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/docs">
                <Button size="lg" className="rounded-full px-8 py-4 text-lg font-bold bg-primary text-white hover:bg-primary-dark transition-colors">
                  Browse Documentation
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-4 text-lg font-bold border-primary text-primary hover:bg-primary-light hover:text-primary-dark transition-colors">
                  Search Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-neutral-light dark:bg-neutral rounded-2xl shadow-lg py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Everything you need for great documentation
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Powerful features to help you create, manage, and share your documentation.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Documents */}
        {featuredDocs.length > 0 && (
          <div className="bg-surface dark:bg-neutral-dark rounded-2xl shadow-lg py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Featured Documentation
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  Discover our most popular and helpful documentation.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredDocs.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link to="/docs">
                  <Button variant="outline" size="lg">
                    View All Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};