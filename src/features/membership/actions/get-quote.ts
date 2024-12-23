import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getQuote(id: string) {
  const { data, error } = await supabaseAdminClient.from('quotes').select('*').eq('id', id).single();
  if (error) {
    console.error(error);
  }
  return data;
}
