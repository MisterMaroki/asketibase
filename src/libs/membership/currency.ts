import { CURRENCIES } from '@/constants';

export function getCurrencySymbol(currencyCode: string | null): string {
  if (!currencyCode) return '$';
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return currency?.symbol || '$';
}

export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatPriceWithCurrency(price: number, currencyCode: string): string {
  const currency = getCurrencySymbol(currencyCode);
  return `${currency} ${formatPrice(price)}`;
}
