'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

type UpsertReq = {
  amount: number;
  membership_id: string;
  currency: string;
  quote_id: string;
  session_id: string;
  status: string;
  // user_id: string;
  gbp_amount: number | null;
};

export async function upsertPayment(payment: UpsertReq) {
  const { data, error } = await supabaseAdminClient.from('stripe_payments').upsert(payment).select();
  if (error) {
    console.error(error);
  }
  return data;
}
