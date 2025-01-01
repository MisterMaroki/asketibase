'use server';

import { QuoteType } from '../components/sections/summary/QuoteGenerator';
import { getFormattedQuote } from '../controllers/quote-memberships';

export async function loadQuoteAction(id: string): Promise<QuoteType | null> {
  try {
    return await getFormattedQuote(id);
  } catch (error) {
    console.error('Failed to load quote:', error);
    return null;
  }
}
