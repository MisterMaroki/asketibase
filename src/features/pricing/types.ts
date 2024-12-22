import { Database } from '@/libs/supabase/types';

export type BillingInterval = 'year' | 'month';
export type Product = Database['public']['Tables']['products']['Row'];
export type Price = Database['public']['Tables']['prices']['Row'];
export type ProductWithPrices = Product & { prices: Price[] };
export type PriceWithProduct = Price & { products: Product | null };
