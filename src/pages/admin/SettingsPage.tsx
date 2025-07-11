import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { AppSettings } from '../../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AppSettings>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .single();
    if (error) setError(error.message);
    else setSettings(data || {});
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    // Only update the first row (assuming single settings row)
    const { error } = await supabase
      .from('app_settings')
      .update(settings)
      .eq('id', settings.id)
      .select()
      .single();
    if (error) setError(error.message);
    else setSuccess('Settings updated successfully.');
    setSaving(false);
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">App Settings</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}
        {loading ? <div>Loading...</div> : (
          <div className="bg-surface rounded-2xl shadow-lg border border-neutral-light dark:border-neutral-dark/60 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input label="Site Name" name="site_name" value={settings.site_name || ''} onChange={handleInputChange} required />
              <Input label="Site Description" name="site_description" value={settings.site_description || ''} onChange={handleInputChange} required />
              <Input label="Logo URL" name="logo_url" value={settings.logo_url || ''} onChange={handleInputChange} />
              <Input label="Favicon URL" name="favicon_url" value={settings.favicon_url || ''} onChange={handleInputChange} />
              <Input label="Accent Color" name="accent_color" value={settings.accent_color || ''} onChange={handleInputChange} />
              <Input label="Footer Text" name="footer_text" value={settings.footer_text || ''} onChange={handleInputChange} />
              <div className="flex items-center space-x-2 mt-2">
                <input type="checkbox" name="enable_search" checked={!!settings.enable_search} onChange={handleInputChange} />
                <label htmlFor="enable_search">Enable Search</label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input type="checkbox" name="enable_dark_mode" checked={!!settings.enable_dark_mode} onChange={handleInputChange} />
                <label htmlFor="enable_dark_mode">Enable Dark Mode</label>
              </div>
              <Input label="Default Theme" name="default_theme" value={settings.default_theme || ''} onChange={handleInputChange} placeholder="light, dark, or system" />
            </div>
            <Button onClick={handleSave} loading={saving}>Save Settings</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SettingsPage; 