'use server';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getAgeFactors() {
  const { data, error } = await supabaseAdminClient
    .from('age_factors')
    .select('*')
    .order('min_age', { ascending: true });

  if (error) throw new Error('Failed to fetch age factors');

  return data;
}

export async function updateAgeFactor({
  id,
  dailyRate,
  minAge,
  maxAge,
}: {
  id: string;
  dailyRate: number;
  minAge: number;
  maxAge: number;
}) {
  const { error } = await supabaseAdminClient
    .from('age_factors')
    .update({
      daily_rate: dailyRate,
      min_age: minAge,
      max_age: maxAge,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error('Failed to update age factor');
}
