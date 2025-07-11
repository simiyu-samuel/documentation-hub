import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { Tag } from '../../types';

export const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Tag>>({ name: '', slug: '', color: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    if (error) setError(error.message);
    else setTags(data || []);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.color) {
      setError('Name, slug, and color are required.');
      return;
    }
    setSaving(true);
    setError(null);
    let color = form.color || '#38bdf8'; // Default to Tailwind sky-400
    let result;
    if (editingId) {
      result = await supabase
        .from('tags')
        .update({ ...form, color })
        .eq('id', editingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('tags')
        .insert([{ ...form, color }])
        .select()
        .single();
    }
    if (result.error) setError(result.error.message);
    else {
      setForm({ name: '', slug: '', color: '' });
      setEditingId(null);
      fetchTags();
    }
    setSaving(false);
  };

  const handleEdit = (tag: Tag) => {
    setForm({ name: tag.name, slug: tag.slug, color: tag.color });
    setEditingId(tag.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this tag?')) return;
    setLoading(true);
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    if (error) setError(error.message);
    fetchTags();
    setLoading(false);
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Tags</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        <div className="bg-surface rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Tag' : 'Add Tag'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Name" name="name" value={form.name || ''} onChange={handleInputChange} required />
            <Input label="Slug" name="slug" value={form.slug || ''} onChange={handleInputChange} required />
            <Input label="Color" name="color" value={form.color || ''} onChange={handleInputChange} placeholder="#color or tailwind class" required />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave} loading={saving}>{editingId ? 'Update' : 'Add'}</Button>
            {editingId && <Button variant="secondary" onClick={() => { setForm({ name: '', slug: '', color: '' }); setEditingId(null); }}>Cancel</Button>}
          </div>
        </div>
        <div className="bg-surface rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          {loading ? <div>Loading...</div> : (
            <table className="min-w-full divide-y divide-neutral/10">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map(tag => (
                  <tr key={tag.id}>
                    <td className="px-4 py-2">{tag.name}</td>
                    <td className="px-4 py-2">{tag.slug}</td>
                    <td className="px-4 py-2">{tag.color}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(tag)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(tag.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TagsPage; 