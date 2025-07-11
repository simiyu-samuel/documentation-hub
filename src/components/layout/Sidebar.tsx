import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Folder, Tag, Clock, TrendingUp, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category, DocumentWithRelations } from '../../types';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentWithRelations[]>([]);
  const [popularDocs, setPopularDocs] = useState<DocumentWithRelations[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    fetchRecentDocs();
    fetchPopularDocs();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) {
      setCategories(data);
      // Auto-expand first category
      if (data.length > 0) {
        setExpandedCategories(new Set([data[0].id]));
      }
    }
  };

  const fetchRecentDocs = async () => {
    const { data } = await supabase
      .from('documents')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) {
      setRecentDocs(data);
    }
  };

  const fetchPopularDocs = async () => {
    const { data } = await supabase
      .from('documents')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(5);
    
    if (data) {
      setPopularDocs(data);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6 space-y-8">
      {/* Quick Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary-500" />
          Quick Access
        </h2>
        <div className="space-y-2">
          <Link
            to="/docs"
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group',
              isActive('/docs')
                ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-soft'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            <FileText className="h-5 w-5" />
            <span>All Documentation</span>
          </Link>
          <Link
            to="/search"
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group',
              isActive('/search')
                ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-soft'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            <Tag className="h-5 w-5" />
            <span>Search Docs</span>
          </Link>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4 flex items-center">
          <Folder className="h-4 w-4 mr-2" />
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center">
                <motion.button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors duration-200 mr-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: expandedCategories.has(category.id) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-primary-500" />
                  </motion.div>
                </motion.button>
                <Link
                  to={`/docs?category=${category.id}`}
                  className={cn(
                    'flex-1 flex items-center space-x-3 px-3 py-2 rounded-xl font-medium transition-all duration-200 group',
                    location.search.includes(`category=${category.id}`)
                      ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-soft'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full shadow-soft"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </Link>
              </div>
              <AnimatePresence>
                {expandedCategories.has(category.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-2 overflow-hidden"
                  >
                    <CategoryDocs categoryId={category.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Recent
        </h3>
        <div className="space-y-1">
          {recentDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/docs/${doc.slug}`}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive(`/docs/${doc.slug}`)
                    ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-soft'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
                )}
              >
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{doc.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Popular Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Popular
        </h3>
        <div className="space-y-1">
          {popularDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={`/docs/${doc.slug}`}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive(`/docs/${doc.slug}`)
                    ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-soft'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
                )}
              >
                <Star className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{doc.title}</span>
                <span className="text-xs text-neutral-400 ml-auto">
                  {doc.view_count}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const CategoryDocs: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const [docs, setDocs] = useState<DocumentWithRelations[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetchCategoryDocs();
  }, [categoryId]);

  const fetchCategoryDocs = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('title', { ascending: true })
      .limit(10);
    
    if (data) {
      setDocs(data);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="space-y-1 border-l-2 border-primary-200 dark:border-primary-800 pl-4">
      {docs.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Link
            to={`/docs/${doc.slug}`}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
              isActive(`/docs/${doc.slug}`)
                ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 shadow-soft'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            <FileText className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{doc.title}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};