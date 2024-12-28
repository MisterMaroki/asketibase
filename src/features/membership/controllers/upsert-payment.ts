import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Database } from '@/libs/supabase/types';

type UpsertReq = {
  amount: number;
  membership_id: string | null;
  currency: string;
  quote_id: string | null;
  session_id: string;
  status: string;
  user_id: string;
};

export async function upsertPayment(payment: UpsertReq) {
  const { data, error } = await supabaseAdminClient
    .from('stripe_payments')
    .upsert(payment as any)
    .select();
  if (error) {
    console.error(error);
  }
  return data;
}
