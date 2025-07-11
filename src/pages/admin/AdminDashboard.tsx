import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Settings, BarChart3, Plus, Eye } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { useDocuments } from '../../hooks/useDocuments';

export const AdminDashboard: React.FC = () => {
  const { documents: allDocs } = useDocuments({});
  const { documents: publishedDocs } = useDocuments({ status: 'published' });
  const { documents: draftDocs } = useDocuments({ status: 'draft' });

  const stats = [
    {
      name: 'Total Documents',
      value: allDocs.length,
      icon: FileText,
      color: 'bg-secondary-500',
    },
    {
      name: 'Published',
      value: publishedDocs.length,
      icon: Eye,
      color: 'bg-success-500',
    },
    {
      name: 'Drafts',
      value: draftDocs.length,
      icon: FileText,
      color: 'bg-warning-500',
    },
    {
      name: 'Total Views',
      value: allDocs.reduce((sum, doc) => sum + doc.view_count, 0),
      icon: BarChart3,
      color: 'bg-accent-500',
    },
  ];

  const quickActions = [
    {
      name: 'Create Document',
      href: '/admin/documents/new',
      icon: Plus,
      color: 'bg-secondary-600 hover:bg-secondary-700',
    },
    {
      name: 'Manage Categories',
      href: '/admin/categories',
      icon: Settings,
      color: 'bg-success-600 hover:bg-success-700',
    },
    {
      name: 'Manage Tags',
      href: '/admin/tags',
      icon: Settings,
      color: 'bg-accent-600 hover:bg-accent-700',
    },
    {
      name: 'App Settings',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-primary-600 hover:bg-primary-700',
    },
  ];

  return (
    <Layout showSidebar={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your documentation platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.name} to={action.href}>
                <div className={`${action.color} rounded-lg p-4 text-white transition-colors`}>
                  <div className="flex items-center">
                    <action.icon className="h-6 w-6 mr-3" />
                    <span className="font-medium">{action.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Documents
            </h2>
            <Link to="/admin/documents">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {allDocs.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {doc.status} • {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={`/admin/documents/${doc.id}/edit`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/docs/${doc.slug}`}>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};