import { getExchangeRate } from './get-rate';

export async function convertToGBP(amount: number, fromCurrency: string): Promise<number | null> {
  if (fromCurrency === 'GBP') return amount;

  const rate = await getExchangeRate(fromCurrency);
  if (!rate) return null;

  // Since our rates are against GBP (GBP is base), we divide by the rate
  return amount / rate;
}
