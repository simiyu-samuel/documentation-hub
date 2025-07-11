import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { DocumentWithRelations } from '../../types';
import { Badge } from '../ui/Badge';
import { Breadcrumb } from '../ui/Breadcrumb';
import { Calendar, User, Eye, Tag as TagIcon, Clock, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import HtmlDocRenderer from './HtmlDocRenderer';

interface DocumentViewerProps {
  document: DocumentWithRelations;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [toc, setTOC] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    // Calculate reading time (average 200 words per minute)
    const wordCount = document.content.split(/\s+/).length;
    setReadingTime(Math.ceil(wordCount / 200));

    // Generate table of contents
    const headings = document.content.match(/^#{1,6}\s+(.+)$/gm) || [];
    const tocItems: TOCItem[] = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const title = heading.replace(/^#+\s+/, '');
      const id = `heading-${index}`;
      return { id, title, level };
    });
    setTOC(tocItems);

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80px 0px' }
    );

    // Observe headings after they're rendered
    setTimeout(() => {
      const headings = window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading: Element) => {
        observer.observe(heading);
      });
    }, 100);

    return () => observer.disconnect();
  }, [document.content]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.description || '',
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const breadcrumbItems = [
    { label: 'Documentation', href: '/docs' },
    ...(document.category ? [{ 
      label: document.category.name, 
      href: `/docs?category=${document.category.id}` 
    }] : []),
    { label: document.title, current: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        <motion.div
          className="lg:col-span-1 order-2 lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="sticky top-24 bg-surface dark:bg-surface-dark rounded-2xl p-6 shadow-card border border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-primary-500" />
              Table of Contents
            </h3>
            <nav className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
              {toc.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm transition-all duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                    activeId === item.id
                      ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-950/30 px-3 py-2 rounded-lg'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  }`}
                  style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                </motion.a>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Document Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <motion.article
            className="bg-surface dark:bg-surface-dark rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-8">
              {/* Breadcrumb */}
              <Breadcrumb items={breadcrumbItems} className="mb-6" />

              {/* Document Header */}
              <header className="mb-8">
                <motion.h1
                  className="text-4xl font-bold text-neutral-900 dark:text-white mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {document.title}
                </motion.h1>
                
                {document.description && (
                  <motion.p
                    className="text-xl text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {document.description}
                  </motion.p>
                )}
                
                <motion.div
                  className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(document.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
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
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="flex flex-wrap items-center justify-between gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {document.category && (
                      <Badge variant="secondary" className="bg-primary-100 text-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
                        {document.category.name}
                      </Badge>
                    )}
                    
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4 text-neutral-400" />
                        <div className="flex flex-wrap gap-1">
                          {document.tags.map((tag) => (
                            <Badge key={tag.id} variant="default" size="sm">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {document.featured && (
                      <Badge variant="warning" className="animate-pulse">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={isBookmarked ? 'text-warning-600' : ''}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </header>

              {/* Document Content */}
              <motion.div
                className="prose prose-lg max-w-none dark:prose-invert prose-modern"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <HtmlDocRenderer html={document.content} title={document.title} />
              </motion.div>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
};