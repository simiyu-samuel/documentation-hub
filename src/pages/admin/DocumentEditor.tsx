import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Upload, X } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TextArea } from '../../components/ui/TextArea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { slugify } from '../../lib/utils';
import { Document, Category, Tag } from '../../types';

export const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = id !== 'new';

  const [document, setDocument] = useState<Partial<Document>>({
    title: '',
    slug: '',
    description: '',
    content: '',
    category_id: '',
    status: 'draft',
    featured: false,
    meta_title: '',
    meta_description: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (isEditing) {
      fetchDocument();
    }
  }, [id, isEditing]);

  const fetchDocument = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          tags:document_tags(tag_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setDocument(data);
      setSelectedTags(data.tags?.map((t: any) => t.tag_id) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
  };

  const fetchTags = async () => {
    const { data } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (data) setTags(data);
  };

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);

      const docData = {
        ...document,
        status,
        author_id: user.id,
        slug: document.slug || slugify(document.title || ''),
      };

      let result;
      if (isEditing) {
        result = await supabase
          .from('documents')
          .update(docData)
          .eq('id', id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('documents')
          .insert([docData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Update tags
      if (result.data) {
        // Remove existing tags
        await supabase
          .from('document_tags')
          .delete()
          .eq('document_id', result.data.id);

        // Add new tags
        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map(tagId => ({
            document_id: result.data.id,
            tag_id: tagId,
          }));

          await supabase
            .from('document_tags')
            .insert(tagInserts);
        }
      }

      navigate('/admin/documents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setDocument(prev => ({
      ...prev,
      title,
      slug: prev.slug || slugify(title),
    }));
  };

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-secondary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/documents')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Document' : 'Create Document'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!document.content}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSave('draft')}
              loading={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave('published')}
              loading={saving}
            >
              <Upload className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface dark:bg-neutral-dark rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8">
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={document.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter document title..."
                  required
                />
                
                <Input
                  label="Slug"
                  value={document.slug || ''}
                  onChange={(e) => setDocument(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  helpText="URL-friendly version of the title"
                />
                
                <TextArea
                  label="Description"
                  value={document.description || ''}
                  onChange={(e) => setDocument(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the document..."
                  rows={3}
                />
                
                <TextArea
                  label="Content"
                  value={document.content || ''}
                  onChange={(e) => setDocument(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your documentation in Markdown..."
                  rows={20}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Settings */}
            <div className="bg-surface dark:bg-neutral-dark rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Document Settings
              </h3>
              <div className="space-y-4">
                <Select
                  label="Category"
                  value={document.category_id || ''}
                  onChange={(e) => setDocument(prev => ({ ...prev, category_id: e.target.value }))}
                  options={[
                    { value: '', label: 'Select category...' },
                    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                  ]}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tags.map(tag => (
                      <label key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTags(prev => [...prev, tag.id]);
                            } else {
                              setSelectedTags(prev => prev.filter(id => id !== tag.id));
                            }
                          }}
                          className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={document.featured || false}
                    onChange={(e) => setDocument(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Featured document
                  </span>
                </label>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-surface dark:bg-neutral-dark rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                SEO Settings
              </h3>
              <div className="space-y-4">
                <Input
                  label="Meta Title"
                  value={document.meta_title || ''}
                  onChange={(e) => setDocument(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title (optional)"
                />
                
                <TextArea
                  label="Meta Description"
                  value={document.meta_description || ''}
                  onChange={(e) => setDocument(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description (optional)"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Document Preview"
          maxWidth="2xl"
        >
          <div className="prose max-w-none dark:prose-invert">
            <h1>{document.title}</h1>
            {document.description && <p className="lead">{document.description}</p>}
            <div dangerouslySetInnerHTML={{ __html: document.content || '' }} />
          </div>
        </Modal>
      </div>
    </Layout>
  );
};