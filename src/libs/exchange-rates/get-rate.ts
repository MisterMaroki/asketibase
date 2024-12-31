import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getExchangeRate(currencyCode: string): Promise<number | null> {
  try {
    const { data, error } = await supabaseAdminClient
      .from('exchange_rates')
      .select('rate')
      .eq('currency_code', currencyCode)
      .single();

    if (error) {
      console.error('Error fetching exchange rate:', error);
      return null;
    }

    return data?.rate || null;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }
}

export async function getAllExchangeRates() {
  try {
    const { data, error } = await supabaseAdminClient.from('exchange_rates').select('*').order('currency_code');

    if (error) {
      console.error('Error fetching exchange rates:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}
