import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Tag as TagIcon, Clock, ArrowRight } from 'lucide-react';
import { DocumentWithRelations } from '../../types';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

interface DocumentCardProps {
  document: DocumentWithRelations;
  variant?: 'default' | 'compact' | 'featured';
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  variant = 'default' 
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className="group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          to={`/docs/${document.slug}`}
          className="block p-4 bg-surface dark:bg-surface-dark rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-medium transition-all duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 truncate">
                {document.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {formatDate(document.created_at)}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        className="group relative overflow-hidden"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl" />
        <div className="relative bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                {document.featured && (
                  <Badge variant="warning" size="sm" className="animate-pulse">
                    Featured
                  </Badge>
                )}
                {document.category && (
                  <Badge variant="secondary" size="sm">
                    {document.category.name}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                <Link to={`/docs/${document.slug}`}>
                  {document.title}
                </Link>
              </h3>
              
              {document.description && (
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                  {truncateText(document.description, 150)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(document.created_at)}</span>
              </div>
              
              {document.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{document.author.full_name || 'Anonymous'}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{document.view_count} views</span>
              </div>
            </div>
            
            <Link
              to={`/docs/${document.slug}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group-hover:translate-x-1 transition-all duration-200"
            >
              Read more
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                {document.category && (
                  <Badge 
                    variant="secondary" 
                    size="sm"
                    className="bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300"
                  >
                    {document.category.name}
                  </Badge>
                )}
                {document.featured && (
                  <Badge variant="warning" size="sm">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                <Link
                  to={`/docs/${document.slug}`}
                  className="hover:underline"
                >
                  {document.title}
                </Link>
              </h3>
              
              {document.description && (
                <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3 leading-relaxed">
                  {document.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(document.created_at)}</span>
              </div>
              
              {document.author && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{document.author.full_name || 'Anonymous'}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{document.view_count}</span>
            </div>
          </div>
          
          {document.tags && document.tags.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <TagIcon className="h-4 w-4 text-neutral-400" />
              <div className="flex flex-wrap gap-1">
                {document.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="default" size="sm">
                    {tag.name}
                  </Badge>
                ))}
                {document.tags.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{document.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center space-x-1 text-xs text-neutral-400">
              <Clock className="h-3 w-3" />
              <span>5 min read</span>
            </div>
            
            <Link
              to={`/docs/${document.slug}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm group-hover:translate-x-1 transition-all duration-200"
            >
              Read more
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};