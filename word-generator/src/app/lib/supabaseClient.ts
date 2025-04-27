'use client'; // Make sure this line is at the top if you are using Next.js app directory

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // Client-side error
    throw new Error('Supabase URL and Key must be provided.');
  }
  // Server-side (build) - don't crash, allow build to continue
}

// Always create a client, even if URL and Key are empty (safe fallback for server build)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
