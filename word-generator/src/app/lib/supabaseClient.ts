'use client'; // Important if you're using app/ directory

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    throw new Error('Supabase environment variables are missing!');
  }
  // Server side: DO NOT throw error, allow build to continue.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
