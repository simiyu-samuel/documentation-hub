import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Settings, Users, ArrowRight, Zap, Shield, Globe, BookOpen, Star, TrendingUp } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { DocumentCard } from '../components/docs/DocumentCard';
import { useDocuments } from '../hooks/useDocuments';
import { useAppSettings } from '../hooks/useAppSettings';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const { documents: featuredDocs } = useDocuments({ status: 'published', limit: 6 });
  const { documents: recentDocs } = useDocuments({ status: 'published', limit: 3 });
  const { settings } = useAppSettings();

  const features = [
    {
      icon: FileText,
      title: 'Rich Documentation',
      description: 'Create beautiful documentation with Markdown support, syntax highlighting, and interactive elements.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50 dark:bg-primary-950/30',
      iconColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find information instantly with full-text search, smart filters, and AI-powered suggestions.',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50 dark:bg-accent-950/30',
      iconColor: 'text-accent-600 dark:text-accent-400',
    },
    {
      icon: Settings,
      title: 'Easy Management',
      description: 'Intuitive admin interface for managing content, users, categories, and customizing your platform.',
      color: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50 dark:bg-success-950/30',
      iconColor: 'text-success-600 dark:text-success-400',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based access control, collaborative editing, and team management features.',
      color: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50 dark:bg-warning-950/30',
      iconColor: 'text-warning-600 dark:text-warning-400',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with lazy loading, caching, and modern web technologies.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with row-level security, authentication, and data protection.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  const stats = [
    { label: 'Documents', value: featuredDocs.length, icon: FileText },
    { label: 'Categories', value: '12+', icon: BookOpen },
    { label: 'Users', value: '500+', icon: Users },
    { label: 'Searches', value: '10K+', icon: Search },
  ];

  return (
    <Layout showSidebar={false}>
      <div className="bg-gradient-to-br from-background via-background-secondary to-background">
        {/* Hero Section */}
        <section className="hero-section relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/50 dark:from-primary-950/20 dark:via-transparent dark:to-accent-950/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
                  <Star className="h-4 w-4 mr-2" />
                  Professional Documentation Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                  <span className="gradient-text">
                    {settings?.site_name || 'Documentation Hub'}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto font-medium leading-relaxed">
                  {settings?.site_description || 'Create, manage, and share beautiful documentation with our modern, feature-rich platform designed for teams and organizations.'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link to="/docs">
                  <Button size="xl" className="group">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Explore Documentation
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" size="xl" className="group">
                    <Search className="h-5 w-5 mr-2" />
                    Search Docs
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-surface/50 dark:bg-surface-dark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                Everything you need for
                <span className="gradient-text"> great documentation</span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Powerful features designed to help you create, manage, and share documentation that your team and users will love.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="feature-card group"
                >
                  <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Documentation */}
        {recentDocs.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center px-4 py-2 bg-accent-100 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium mb-6">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Latest Updates
                </div>
                <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
                  Recent Documentation
                </h2>
                <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                  Stay up to date with our latest documentation and guides.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recentDocs.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <DocumentCard document={doc} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <Link to="/docs">
                  <Button variant="outline" size="lg" className="group">
                    View All Documentation
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of teams who trust our platform for their documentation needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/docs">
                  <Button size="xl" variant="secondary" className="bg-white text-primary-600 hover:bg-neutral-50">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Start Reading
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                    <Users className="h-5 w-5 mr-2" />
                    Join Community
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};