import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail, BookOpen } from 'lucide-react';
import { useAppSettings } from '../../hooks/useAppSettings';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const { settings } = useAppSettings();

  const footerLinks = [
    {
      title: 'Documentation',
      links: [
        { name: 'Getting Started', href: '/docs' },
        { name: 'API Reference', href: '/docs?category=api-reference' },
        { name: 'Tutorials', href: '/docs?category=tutorials' },
        { name: 'FAQ', href: '/docs?category=faq' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Search', href: '/search' },
        { name: 'All Categories', href: '/docs' },
        { name: 'Recent Updates', href: '/docs' },
        { name: 'Popular Docs', href: '/docs' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/docs?category=faq' },
        { name: 'Contact Us', href: 'mailto:support@example.com' },
        { name: 'Community', href: '#' },
        { name: 'Status', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@example.com' },
  ];

  return (
    <footer className="bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-medium">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {settings?.site_name || 'Documentation Hub'}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Professional Documentation Platform
                </p>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
              {settings?.site_description || 'Your comprehensive documentation platform for creating, managing, and sharing professional documentation.'}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-100 dark:hover:bg-primary-950/50 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
            >
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('http') || link.href.startsWith('mailto') ? (
                      <a
                        href={link.href}
                        className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 mb-4 md:mb-0">
            <span className="text-sm">
              © {new Date().getFullYear()} {settings?.site_name || 'Documentation Hub'}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
            <span className="text-sm">
              {settings?.footer_text || 'Built with love for great documentation'}
            </span>
            <Heart className="h-4 w-4 text-error-500 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </footer>
  );
};