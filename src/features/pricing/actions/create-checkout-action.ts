'use server';

import { redirect } from 'next/navigation';

import { getOrCreateCustomer } from '@/features/membership/actions/get-or-create-customer';
import { getQuote } from '@/features/membership/actions/get-quote';
import { getUser } from '@/features/membership/actions/get-user';
import { Price } from '@/features/pricing/types';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export async function createCheckoutAction(id: string) {
  // export async function createCheckoutAction({ price }: { price: Price }) {
  // 1. Get the user from session
  const user = await getUser();

  if (!user?.email) {
    throw Error('Could not get email');
  }

  // 2. Retrieve or create the customer in Stripe
  const customer = await getOrCreateCustomer({
    userId: user.id,
    email: user.email,
  });

  const quote = await getQuote(id);
  if (!quote) {
    throw Error('Could not get quote');
  }

  // 3. Create a checkout session in Stripe
  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    // payment_method_types: ['card'],
    // billing_address_collection: 'required',
    customer,
    mode: 'payment',

    // cus  tomer_update: {
    //   address: 'auto',
    // },
    line_items: [
      {
        price_data: {
          currency: quote.currency,
          product_data: {
            name: 'Asketi Membership',
            // quoteId: quote.id,
          },
          unit_amount: quote.total_price,
        },
        quantity: 1,
      },
    ],
    // mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${getURL()}/membership?step=6`,
    cancel_url: `${getURL()}/membership?step=6`,
  });

  if (!checkoutSession || !checkoutSession.url) {
    throw Error('checkoutSession is not defined');
  }

  // 4. Redirect to checkout url
  redirect(checkoutSession.url);
}
