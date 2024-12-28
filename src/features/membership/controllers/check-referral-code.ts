'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export type ReferralCode = {
  code: string;
  created_at: string;
  discount_percent: number;
  id: string;
};

export async function checkReferralCode(code: string): Promise<ReferralCode | null> {
  const { data, error } = await supabaseAdminClient.from('fires').select('*').eq('code', code).single();

  if (error) {
    return null;
  }

  return data as ReferralCode;
}
