import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Tag as TagIcon } from 'lucide-react';
import { DocumentWithRelations } from '../../types';
import { Badge } from '../ui/Badge';

interface DocumentCardProps {
  document: DocumentWithRelations;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-secondary-200 dark:hover:border-secondary-700 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <Link
                to={`/docs/${document.slug}`}
                className="hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors duration-200 group-hover:text-secondary-600 dark:group-hover:text-secondary-400"
              >
                {document.title}
              </Link>
            </h3>
            
            {document.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {document.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(document.created_at).toLocaleDateString()}</span>
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {document.category && (
                  <Badge variant="secondary" size="sm">
                    {document.category.name}
                  </Badge>
                )}
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <TagIcon className="h-3 w-3 text-gray-400" />
                    <div className="flex space-x-1">
                      {document.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="default" size="sm">
                          {tag.name}
                        </Badge>
                      ))}
                      {document.tags.length > 2 && (
                        <Badge variant="secondary" size="sm">
                          +{document.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {document.featured && (
                <Badge variant="warning" size="sm">
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};