import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useDocuments } from '../../hooks/useDocuments';
import { supabase } from '../../lib/supabase';
import { DocumentWithRelations } from '../../types';

export const DocumentsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; document: DocumentWithRelations | null }>({
    isOpen: false,
    document: null,
  });
  const [deleting, setDeleting] = useState(false);

  const { documents, loading, error, refetch } = useDocuments({
    search: searchQuery || undefined,
    status: statusFilter as any || undefined,
  });

  const handleDelete = async () => {
    if (!deleteModal.document) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', deleteModal.document.id);

      if (error) throw error;
      
      refetch();
      setDeleteModal({ isOpen: false, document: null });
    } catch (err) {
      console.error('Error deleting document:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-primary mb-2">
              Documents
            </h1>
            <p className="text-neutral-light text-lg">
              Manage your documentation content
            </p>
          </div>
          <Link to="/admin/documents/new">
            <Button size="lg" className="rounded-full px-6 py-3 text-lg font-bold bg-primary text-white hover:bg-primary-dark transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              Create Document
            </Button>
          </Link>
        </div>
        {/* Filters */}
        <div className="bg-surface rounded-2xl shadow-card border border-neutral/10 p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
              className="text-lg"
            />
          </div>
        </div>
        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}
        {/* Documents Table */}
        <div className="bg-surface rounded-2xl shadow-card border border-neutral/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral/10">
              <thead className="bg-neutral/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-neutral/10">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-lg font-semibold text-black">
                          {doc.title}
                        </div>
                        <div className="text-neutral truncate max-w-xs">
                          {doc.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {doc.category ? (
                        <Badge variant="secondary">{doc.category.name}</Badge>
                      ) : (
                        <span className="text-neutral-light">No category</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-neutral">
                      {doc.view_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-neutral">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/docs/${doc.slug}`}>
                          <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                            <Eye className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Link to={`/admin/documents/${doc.id}/edit`}>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            <Edit className="h-5 w-5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteModal({ isOpen: true, document: doc })}
                          className="text-error hover:bg-error/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {documents.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center">
              <svg className="w-16 h-16 text-neutral-light mb-4" fill="none" viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" opacity="0.1"/><path d="M16 20h16M16 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p className="text-neutral text-2xl font-semibold mb-2">
                No documents found
              </p>
              <p className="text-neutral-light mb-6">Create your first document to get started.</p>
              <Link to="/admin/documents/new" className="mt-4 inline-block">
                <Button size="lg" className="rounded-full px-6 py-3 text-lg font-bold bg-primary text-white hover:bg-primary-dark transition-colors">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Document
                </Button>
              </Link>
            </div>
          )}
        </div>
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, document: null })}
          title="Delete Document"
        >
          <div className="space-y-4">
            <p className="text-neutral">
              Are you sure you want to delete "{deleteModal.document?.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ isOpen: false, document: null })}
                className="border-neutral text-neutral"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={deleting}
                className="rounded-full px-6 py-3 text-lg font-bold"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};