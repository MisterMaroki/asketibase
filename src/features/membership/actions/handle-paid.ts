'use server';

import Stripe from 'stripe';

import { getQuoteWithMembership, updateApplication } from '../controllers/quote-memberships';
import { upsertPayment } from '../controllers/upsert-payment';

import { generateIfNotSent } from './generate-document';

export async function handlePaid(checkoutSession: Stripe.Checkout.Session) {
  console.log('🚀 ~ handlePaid ~ checkoutSession:', checkoutSession);
  const quoteId = checkoutSession.metadata?.quoteId;
  if (!quoteId) {
    throw Error('Could not get quoteId');
  }
  const quote = await getQuoteWithMembership(quoteId);
  if (!quote) {
    throw Error('Could not get quote');
  }

  const membership = quote.memberships;
  if (!membership) {
    throw Error('Could not get membership');
  }

  if (membership.status !== 'draft') {
    return true;
  }

  await updateApplication(quote.membership_id, {
    status: 'paid',
  });

  const payment = await upsertPayment({
    amount: quote.total_price,
    membership_id: membership.id,
    session_id: checkoutSession.id,
    currency: quote.currency,
    user_id: membership.user_id || '',
    quote_id: quote.id,
    status: 'paid',
  });

  generateIfNotSent(quote.id);

  return payment;
}
