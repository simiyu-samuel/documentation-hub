import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DocumentWithRelations } from '../types';

export const useDocuments = (filters?: {
  category?: string;
  tag?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
}) => {
  const [documents, setDocuments] = useState<DocumentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, [JSON.stringify(filters)]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching documents with filters:', filters);

      let query = supabase
        .from('documents')
        .select(`
          *,
          category:categories(*),
          author:profiles(*),
          tags:document_tags(
            tag:tags(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to flatten tags
      const transformedDocs = data?.map(doc => ({
        ...doc,
        tags: doc.tags?.map((dt: any) => dt.tag).filter(Boolean) || [],
      })) || [];

      // Filter by tag if specified
      if (filters?.tag) {
        const filteredDocs = transformedDocs.filter(doc =>
          doc.tags?.some(tag => tag.slug === filters.tag)
        );
        setDocuments(filteredDocs);
      } else {
        setDocuments(transformedDocs);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchDocuments();
  };

  return { documents, loading, error, refetch };
};