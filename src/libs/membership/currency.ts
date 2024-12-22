import { CURRENCIES } from '@/constants/options';

export function getCurrencySymbol(currencyCode: string | null): string {
  if (!currencyCode) return '$';
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return currency?.symbol || '$';
}
