// hooks/useAvailableMinutes.ts
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useAvailableMinutes() {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    const fetchMinutes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userId = user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('available_minutes')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Failed to fetch minutes:', error.message);
      } else {
        setMinutes(data?.available_minutes ?? 0);
      }
    };

    fetchMinutes();
  }, []);

  return minutes;
}
