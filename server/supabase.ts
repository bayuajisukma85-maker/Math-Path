import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const serverSupabase: SupabaseClient | null = isServerSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;
