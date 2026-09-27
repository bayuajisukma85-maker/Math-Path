import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = 
  (metaEnv.VITE_SUPABASE_URL as string) ||
  (metaEnv.NEXT_PUBLIC_SUPABASE_URL as string) ||
  '';

const supabaseAnonKey = 
  (metaEnv.VITE_SUPABASE_ANON_KEY as string) ||
  (metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
