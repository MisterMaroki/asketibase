'use server';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getMedicalRiskFactors() {
  const { data, error } = await supabaseAdminClient
    .from('medical_risk_factors')
    .select('*')
    .order('risk_level', { ascending: true });

  if (error) throw new Error('Failed to fetch medical risk factors');

  return data;
}

export async function updateMedicalRiskFactor({
  id,
  dailyRate,
  description,
}: {
  id: string;
  dailyRate: number;
  description: string;
}) {
  const { error } = await supabaseAdminClient
    .from('medical_risk_factors')
    .update({
      daily_rate: dailyRate,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error('Failed to update medical risk factor');
}
