import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Database } from '@/libs/supabase/types';

export async function getQuote(id: string) {
  const { data, error } = await supabaseAdminClient.from('quotes').select('*').eq('id', id).single();
  if (error) {
    console.error(error);
  }
  return data;
}

export async function getQuoteWithMembership(quoteId: string) {
  const { data, error } = await supabaseAdminClient
    .from('quotes')
    .select('*, memberships(*)')
    .eq('id', quoteId)
    .single();
  if (error) {
    console.error(error);
  }
  return data;
}

export async function updateQuote(id: string, data: Partial<Database['public']['Tables']['quotes']['Row']>) {
  const { data: updatedData, error } = await supabaseAdminClient.from('quotes').update(data).eq('id', id).select();
  if (error) {
    console.error(error);
  }
  return updatedData;
}

export async function updateApplication(id: string, data: Partial<Database['public']['Tables']['memberships']['Row']>) {
  const { data: updatedData, error } = await supabaseAdminClient.from('memberships').update(data).eq('id', id).select();
  if (error) {
    console.error(error);
  }
  return updatedData;
}
