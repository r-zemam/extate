import { createClient } from '@supabase/supabase-js';

/**
 * Get Supabase client instance
 * Creates a new client with environment variables
 * This function ensures environment variables are read at runtime
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'your-supabase-project-url') {
    throw new Error(
      'Missing or invalid NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
      'Please add your actual Supabase project URL to .env.local file.'
    );
  }

  if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
    throw new Error(
      'Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
      'Please add your actual Supabase anon key to .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Export a singleton instance
export const supabase = getSupabaseClient();
