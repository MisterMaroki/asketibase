'use server';

import Stripe from 'stripe';

import { getQuoteWithMembership, updateApplication } from '../controllers/quote-memberships';
import { upsertPayment } from '../controllers/upsert-payment';

import { generateIfNotSent } from './generate-document';
import { logOperation } from './log-action';

export async function handlePaid(checkoutSession: Stripe.Checkout.Session) {
  await logOperation({
    level: 'info',
    operation: 'handle_paid_started',
    details: { checkoutSession },
  });
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

  await updateApplication(membership.id, {
    status: 'paid',
  });

  const payment = await upsertPayment({
    amount: quote.total_price,
    gbp_amount: quote.gbp_total,
    membership_id: membership.id,
    session_id: checkoutSession.id,
    currency: quote.currency,
    // user_id: membership.user_id || '',
    quote_id: quote.id,
    status: 'paid',
  });

  await logOperation({
    level: 'info',
    operation: 'handle_paid_completed',
    details: { payment },
  });

  generateIfNotSent(quote.id);

  return payment;
}
