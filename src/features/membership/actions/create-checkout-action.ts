'use server';

import { redirect } from 'next/navigation';

import { getDurationDetails } from '@/constants/membership';
import { getOrCreateCustomer } from '@/features/membership/controllers/get-or-create-customer';
import { getUser } from '@/features/membership/controllers/get-user';
import { getQuoteWithMembership } from '@/features/membership/controllers/quote-memberships';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getURL } from '@/utils/get-url';

import { getMembershipMembers } from '../controllers/members';

export async function createCheckoutAction(id: string) {
  // export async function createCheckoutAction({ price }: { price: Price }) {
  // 1. Get the user from session
  // const user = await getUser();
  // console.log('🚀 ~ createCheckoutAction ~ user:', user);

  // if (!user?.email) {
  //   redirect(`${getURL()}/membership?step=5&error=true`);
  // }
  const quote = await getQuoteWithMembership(id);
  if (!quote) {
    redirect(`${getURL()}/membership?step=5&error=true`);
  }

  const primaryMember = await getMembershipMembers(quote.memberships.id).then((members) =>
    members?.find((member) => member.is_primary)
  );

  if (!primaryMember) {
    redirect(`${getURL()}/membership?step=5&error=true`);
  }

  const tx = await supabaseAdminClient.from('stripe_payments').select('*').eq('quote_id', quote.id).single();

  if (quote.memberships.status !== 'draft' && tx.data?.status === 'paid') {
    redirect(`${getURL()}/membership/success?quoteId=${quote.id}&sessionId=${tx.data.session_id}`);
  } else if (tx.data) {
    throw Error('Payment already made');
  }

  // 2. Retrieve or create the customer in Stripe
  const customer = await getOrCreateCustomer({
    userId: primaryMember?.id || '',
    email: primaryMember?.email || '',
  });

  // 3. Create a checkout session in Stripe
  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    // payment_method_types: ['card', 'sepa_debit'],
    // billing_address_collection: 'required',
    customer,
    mode: 'payment',

    metadata: {
      quoteId: quote.id,
      userId: primaryMember.id,
    },
    line_items: [
      {
        price_data: {
          currency: quote.currency,
          product_data: {
            name: 'Asketi Membership',
            description: `Membership Type: ${quote.memberships.membership_type} |
              Coverage Type: ${quote.memberships.coverage_type} |
              Duration Type: ${getDurationDetails(quote.memberships.duration_type).title}`,
          },
          unit_amount: quote.total_price_with_tax * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `${getURL()}/membership/success?quoteId=${quote.id}&sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getURL()}/membership?step=5&error=true`,
  });

  if (!checkoutSession || !checkoutSession.url) {
    throw Error('checkoutSession is not defined');
  }

  // 4. Redirect to checkout url
  redirect(checkoutSession.url);
}
