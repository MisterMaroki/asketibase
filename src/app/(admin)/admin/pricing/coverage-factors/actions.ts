'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getCoverageFactors() {
  const { data, error } = await supabaseAdminClient
    .from('coverage_factors')
    .select('*')
    .order('coverage_type', { ascending: true });

  if (error) throw new Error('Failed to fetch coverage factors');

  return data;
}

export async function updateCoverageFactor({ id, dailyRate }: { id: string; dailyRate: number }) {
  const { error } = await supabaseAdminClient
    .from('coverage_factors')
    .update({
      daily_rate: dailyRate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error('Failed to update coverage factor');

  revalidatePath('/admin/pricing');
}
