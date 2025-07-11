import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Folder, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category, DocumentWithRelations } from '../../types';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentWithRelations[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    fetchCategories();
    fetchRecentDocs();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) {
      setCategories(data);
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
    <div className="w-64 bg-background border-r border-neutral h-full overflow-y-auto shadow-card">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
          Documentation
        </h2>
        {/* Categories */}
        <div className="space-y-3 mb-10">
          <h3 className="text-xs font-semibold text-neutral-light uppercase tracking-widest mb-2">
            Categories
          </h3>
          {categories.map((category) => (
            <div key={category.id} className="mb-1">
              <div className="flex items-center">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-full hover:bg-primary/10 transition-colors mr-2',
                    expandedCategories.has(category.id) ? 'bg-primary/10' : 'bg-transparent'
                  )}
                  title={expandedCategories.has(category.id) ? 'Collapse' : 'Expand'}
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                </button>
                <Link
                  to={`/docs/category/${category.slug}`}
                  className={cn(
                    'flex-1 flex items-center space-x-2 px-3 py-2 text-base rounded-lg font-semibold transition-colors',
                    location.pathname === `/docs/category/${category.slug}`
                      ? 'bg-primary text-white shadow-card'
                      : 'text-white hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  <Folder className="h-5 w-5 text-primary" />
                  <span>{category.name}</span>
                </Link>
              </div>
              {expandedCategories.has(category.id) && (
                <CategoryDocs categoryId={category.id} />
              )}
            </div>
          ))}
        </div>
        {/* Recent Documents */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-neutral-light uppercase tracking-widest mb-2">
            Recent
          </h3>
          {recentDocs.map((doc) => (
            <Link
              key={doc.id}
              to={`/docs/${doc.slug}`}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors',
                location.pathname === `/docs/${doc.slug}`
                  ? 'bg-primary text-white shadow-card'
                  : 'text-white hover:bg-primary/10 hover:text-primary'
              )}
            >
              <FileText className="h-4 w-4 text-primary" />
              <span className="truncate">{doc.title}</span>
            </Link>
          ))}
        </div>
      </div>
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
      .order('title', { ascending: true });
    
    if (data) {
      setDocs(data);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="ml-8 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
      {docs.map((doc) => (
        <Link
          key={doc.id}
          to={`/docs/${doc.slug}`}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors',
            location.pathname === `/docs/${doc.slug}`
              ? 'bg-primary text-white shadow-card'
              : 'text-white hover:bg-primary/10 hover:text-primary'
          )}
        >
          <FileText className="h-4 w-4 text-primary" />
          <span className="truncate">{doc.title}</span>
        </Link>
      ))}
    </div>
  );
};