import { CURRENCIES } from '@/constants';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const BASE_CURRENCY = 'GBP';

export async function updateExchangeRates() {
  try {
    if (!API_KEY) {
      throw new Error('Exchange rate API key is not configured');
    }

    // Fetch latest rates from the API
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);

    console.log('🚀 ~ updateExchangeRates ~ response:', response);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    const rates = data.conversion_rates;
    console.log('🚀 ~ updateExchangeRates ~ rates:', rates);

    // Prepare the exchange rates data for our currencies
    const exchangeRates = CURRENCIES.map((currency) => ({
      currency_code: currency.code,
      rate: rates[currency.code] || null,
      last_updated: new Date().toISOString(),
    })).filter((rate) => rate.rate !== null); // Filter out any currencies that don't have rates

    console.log('🚀 ~ exchangeRates ~ exchangeRates:', exchangeRates);
    // Upsert the rates into our database
    const { error } = await supabaseAdminClient.from('exchange_rates').upsert(exchangeRates, {
      onConflict: 'currency_code',
    });
    console.log('🚀 ~ const{error}=awaitsupabaseAdminClient.from ~ error:', error);

    if (error) {
      throw error;
    }

    console.log('Exchange rates updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return { success: false, error };
  }
}
