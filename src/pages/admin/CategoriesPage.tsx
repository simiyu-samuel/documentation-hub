import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Category>>({ name: '', slug: '', description: '', color: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) setError(error.message);
    else setCategories(data || []);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      setError('Name and slug are required.');
      return;
    }
    setSaving(true);
    setError(null);
    let result;
    if (editingId) {
      result = await supabase
        .from('categories')
        .update({ ...form })
        .eq('id', editingId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('categories')
        .insert([{ ...form }])
        .select()
        .single();
    }
    if (result.error) setError(result.error.message);
    else {
      setForm({ name: '', slug: '', description: '', color: '' });
      setEditingId(null);
      fetchCategories();
    }
    setSaving(false);
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color });
    setEditingId(cat.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) setError(error.message);
    fetchCategories();
    setLoading(false);
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        <div className="bg-surface rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Category' : 'Add Category'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Name" name="name" value={form.name || ''} onChange={handleInputChange} required />
            <Input label="Slug" name="slug" value={form.slug || ''} onChange={handleInputChange} required />
            <Input label="Color" name="color" value={form.color || ''} onChange={handleInputChange} placeholder="#color or tailwind class" />
            <Input label="Description" name="description" value={form.description || ''} onChange={handleInputChange} />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave} loading={saving}>{editingId ? 'Update' : 'Add'}</Button>
            {editingId && <Button variant="secondary" onClick={() => { setForm({ name: '', slug: '', description: '', color: '' }); setEditingId(null); }}>Cancel</Button>}
          </div>
        </div>
        <div className="bg-surface rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          {loading ? <div>Loading...</div> : (
            <table className="min-w-full divide-y divide-neutral/10">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">Color</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2">{cat.slug}</td>
                    <td className="px-4 py-2">{cat.color}</td>
                    <td className="px-4 py-2">{cat.description}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(cat.id)}>Delete</Button>
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

export default CategoriesPage; 