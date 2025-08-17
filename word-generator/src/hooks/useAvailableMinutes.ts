import { useEffect, useState } from 'react';
import { supabase } from '../app/lib/supabaseClient';

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

  const deductMinutes = async (amount: number) => {
  setLoading(true);
  const { data, error } = await supabase.rpc('consume_minutes', { p_amount: amount });
  setLoading(false);

  if (error) {
    // optional: handle "INSUFFICIENT_MINUTES"
    console.error('[consume_minutes]', error);
    return false;
  }

  setMinutes(data as number); // remaining minutes from DB
  return true;
};


  const refreshMinutes = () => {
    fetchMinutes();
  };

const addMinutes = async (amount: number) => {
  setLoading(true);
  const { data, error } = await supabase.rpc('grant_minutes', { p_amount: amount });
  setLoading(false);
  if (error) { console.error('[grant_minutes]', error); return false; }
  setMinutes(data as number);
  return true;
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