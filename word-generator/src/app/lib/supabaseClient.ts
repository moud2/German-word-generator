import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // ❗ Throw error only in the browser (client-side)
    throw new Error('Supabase environment variables are missing!');
  }
  // ❗ On server side (Render build), don't throw, let it continue
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
