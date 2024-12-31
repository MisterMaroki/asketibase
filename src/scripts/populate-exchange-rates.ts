import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

// Example rates against GBP (GBP is base currency)
const initialRates = [
  { currency_code: 'USD', rate: 1.27 }, // 1 GBP = 1.27 USD
  { currency_code: 'EUR', rate: 1.17 }, // 1 GBP = 1.17 EUR
  { currency_code: 'JPY', rate: 188.5 }, // 1 GBP = 188.5 JPY
  { currency_code: 'SGD', rate: 1.7 }, // 1 GBP = 1.70 SGD
  { currency_code: 'GBP', rate: 1.0 }, // Base currency
  { currency_code: 'AUD', rate: 1.6 }, // 1 GBP = 1.60 AUD
  { currency_code: 'NZD', rate: 1.8 }, // 1 GBP = 1.80 NZD
  { currency_code: 'CAD', rate: 1.6 }, // 1 GBP = 1.60 CAD
  { currency_code: 'ZAR', rate: 18.5 }, // 1 GBP = 18.50 ZAR
];

async function populateExchangeRates() {
  const { error } = await supabaseAdminClient.from('exchange_rates').upsert(
    initialRates.map((rate) => ({
      ...rate,
      last_updated: new Date().toISOString(),
    })),
  );

  if (error) {
    console.error('Error populating exchange rates:', error);
    process.exit(1);
  }

  console.log('Exchange rates populated successfully');
  process.exit(0);
}

populateExchangeRates();
