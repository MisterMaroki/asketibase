'use server';

import { redirect } from 'next/navigation';

import { getDurationDetails } from '@/constants';
import { getOrCreateCustomer } from '@/features/membership/controllers/get-or-create-customer';
import { getUser } from '@/features/membership/controllers/get-user';
import { getQuoteWithMembership } from '@/features/membership/controllers/quote-memberships';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getURL } from '@/utils/get-url';

import { getMembershipMembers } from '../controllers/members';

export async function createCheckoutAction(id: string) {
  // 1. Get the user from session
  const user = await getUser();

  // If no user is logged in, throw error
  if (!user?.email) {
    throw new Error('No user logged in');
  }

  const quote = await getQuoteWithMembership(id);
  if (!quote) {
    redirect(`${getURL()}/membership?step=5&error=true`);
  }

  // Update membership with user_id if not set
  if (!quote.memberships.user_id) {
    const { error: membershipError } = await supabaseAdminClient
      .from('memberships')
      .update({ user_id: user.id })
      .eq('id', quote.memberships.id);

    if (membershipError) {
      console.error('Failed to update membership with user ID:', membershipError);
      throw Error('Failed to update membership');
    }
  }

  const primaryMember = await getMembershipMembers(quote.memberships.id).then((members) =>
    members?.find((member) => member.is_primary),
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

  // Retrieve or create the customer in Stripe
  const customer = await getOrCreateCustomer({
    userId: primaryMember.id,
    email: primaryMember.email,
  });

  // Create a checkout session in Stripe
  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    customer,
    mode: 'payment',
    metadata: {
      quoteId: quote.id,
      userId: user.id,
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
          unit_amount: Math.round(quote.total_price_with_tax * 100),
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

  // Redirect to checkout url
  redirect(checkoutSession.url);
}
