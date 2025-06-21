// hooks/useAvailableMinutes.ts
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useAvailableMinutes() {
  const [minutes, setMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

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

  const deductMinutes = async (minutesToDeduct: number) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      if (!userId) throw new Error('User not authenticated');

      // First get current minutes
      const { data: currentData, error: fetchError } = await supabase
        .from('profiles')
        .select('available_minutes')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentMinutes = currentData?.available_minutes ?? 0;
      const newMinutes = Math.max(0, currentMinutes - minutesToDeduct);

      // Update minutes in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ available_minutes: newMinutes })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state
      setMinutes(newMinutes);
      return true;
    } catch (error) {
      console.error('Failed to deduct minutes:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshMinutes = () => {
    fetchMinutes();
  };

  const addMinutes = async (minutesToAdd: number) => {
  setLoading(true);
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) throw new Error('User not authenticated');

    // First get current minutes
    const { data: currentData, error: fetchError } = await supabase
      .from('profiles')
      .select('available_minutes')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    const currentMinutes = currentData?.available_minutes ?? 0;
    const newMinutes = currentMinutes + minutesToAdd;

    // Update minutes in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ available_minutes: newMinutes })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Update local state
    setMinutes(newMinutes);
    return true;
  } catch (error) {
    console.error('Failed to add minutes:', error);
    return false;
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMinutes();
  }, []);

  return { 
    minutes, 
    deductMinutes, 
    refreshMinutes, 
     addMinutes,
    loading 
  };
}