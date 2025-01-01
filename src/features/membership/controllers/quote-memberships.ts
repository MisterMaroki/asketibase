import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Database } from '@/libs/supabase/types';

import { QuoteType } from '../components/sections/summary/QuoteGenerator';

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

export async function getFormattedQuote(id: string): Promise<QuoteType | null> {
  const quote = await getQuoteWithMembership(id);
  if (!quote || !quote.memberships.start_date || !quote.memberships.end_date) return null;

  return {
    id: quote.id,
    currency: quote.currency,
    coverageType: quote.memberships.coverage_type,
    duration: quote.memberships.duration_type,
    startDate: quote.memberships.start_date,
    endDate: quote.memberships.end_date,
    members: quote.member_prices as QuoteType['members'],
    totalPremium: quote.total_price,
    taxAmount: quote.tax_amount,
    discountApplied: quote.discount_amount,
    finalPremium: quote.total_price_with_tax,
    referralCode: '',
  };
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
