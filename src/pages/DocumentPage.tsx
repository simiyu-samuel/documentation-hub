import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../components/layout/Layout';
import { DocumentViewer } from '../components/docs/DocumentViewer';
import { supabase } from '../lib/supabase';
import { DocumentWithRelations } from '../types';

export const DocumentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [document, setDocument] = useState<DocumentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchDocument();
    }
  }, [slug]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the document
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select(`
          *,
          category:categories(*),
          author:profiles(*),
          tags:document_tags(
            tag:tags(*)
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (docError) throw docError;

      // Transform the data to flatten tags
      const transformedDoc = {
        ...doc,
        tags: doc.tags?.map((dt: any) => dt.tag).filter(Boolean) || [],
      };

      setDocument(transformedDoc);

      // Increment view count
      await supabase.rpc('increment_document_views', { doc_id: doc.id });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Document not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !document) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Layout>
      <Helmet>
        <title>{document.meta_title || document.title}</title>
        <meta name="description" content={document.meta_description || document.description} />
        <meta property="og:title" content={document.meta_title || document.title} />
        <meta property="og:description" content={document.meta_description || document.description} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={document.meta_title || document.title} />
        <meta name="twitter:description" content={document.meta_description || document.description} />
      </Helmet>
      <DocumentViewer document={document} />
    </Layout>
  );
};