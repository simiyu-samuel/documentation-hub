import { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentTag = Database['public']['Tables']['document_tags']['Row'];
export type AppSettings = Database['public']['Tables']['app_settings']['Row'];

export type DocumentWithRelations = Document & {
  category?: Category | null;
  tags?: Tag[];
  author?: Profile | null;
};

export type UserRole = 'admin' | 'public';
export type DocumentStatus = 'draft' | 'published' | 'archived';
export type Theme = 'light' | 'dark' | 'system';