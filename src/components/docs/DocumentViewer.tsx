import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import tomorrow from 'react-syntax-highlighter/dist/styles/tomorrow';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { DocumentWithRelations } from '../../types';
import { Badge } from '../ui/Badge';
import { Calendar, User, Eye, Tag as TagIcon, Link as LinkIcon } from 'lucide-react';

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

  useEffect(() => {
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
      // Use the global document object, which has querySelectorAll
      const headings = window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading: Element) => {
        observer.observe(heading);
      });
    }, 100);

    return () => observer.disconnect();
  }, [document.content]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-surface dark:bg-neutral-dark rounded-2xl p-6 shadow-lg border border-neutral-light dark:border-neutral-dark/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-sm transition-colors ${
                    activeId === item.id
                      ? 'text-secondary-600 dark:text-secondary-400 font-medium'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Document Content */}
        <div className="lg:col-span-3">
          <article className="bg-surface dark:bg-neutral-dark rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 animate-slide-up">
            <div className="p-8">
              {/* Document Header */}
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {document.title}
                </h1>
                
                {document.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {document.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
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
                
                <div className="flex items-center space-x-4">
                  {document.category && (
                    <Badge variant="secondary">
                      {document.category.name}
                    </Badge>
                  )}
                  
                  {document.tags && document.tags.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <div className="flex space-x-1">
                        {document.tags.map((tag) => (
                          <Badge key={tag.id} variant="default" size="sm">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </header>

              {/* Document Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            background: '#1e293b',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children, ...props }) => (
                      <h1 id={`heading-${toc.findIndex(item => item.title === children)}`} {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 id={`heading-${toc.findIndex(item => item.title === children)}`} {...props}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 id={`heading-${toc.findIndex(item => item.title === children)}`} {...props}>
                        {children}
                      </h3>
                    ),
                    h4: ({ children, ...props }) => (
                      <h4 id={`heading-${toc.findIndex(item => item.title === children)}`} {...props}>
                        {children}
                      </h4>
                    ),
                    h5: ({ children, ...props }) => (
                      <h5 id={`heading-${toc.findIndex(item => item.title === children)}`} {...props}>
                        {children}
                      </h5>
                    ),
                    h6: ({ children, ...props }) => (
                      <h6 id={`heading-${toc.findIndex(item => item.title === children)}`} {...props}>
                        {children}
                      </h6>
                    ),
                  }}
                >
                  {document.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};