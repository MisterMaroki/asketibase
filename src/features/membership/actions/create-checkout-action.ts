'use server';

import { redirect } from 'next/navigation';

import { COVERAGE_TYPES, getDurationDetails, MEMBERSHIP_TYPES } from '@/constants';
import { getOrCreateCustomer } from '@/features/membership/controllers/get-or-create-customer';
import { getQuoteWithMembership } from '@/features/membership/controllers/quote-memberships';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getURL } from '@/utils/get-url';

import { getMembershipMembers } from '../controllers/members';

import { logOperation } from './log-action';

export async function createCheckoutAction(id: string, isAfrica: boolean = false) {
  // // 1. Get the user from session
  // const user = await getUser();

  // // If no user is logged in, throw error
  // if (!user?.email) {
  //   return {
  //     success: false,
  //     error: 'No user logged in.',
  //   };
  // }

  await logOperation({
    level: 'info',
    operation: 'checkout_action_started',
    details: { id },
  });

  const quote = await getQuoteWithMembership(id);
  if (!quote) {
    redirect(`${getURL(isAfrica ? '/africa' : '')}/?step=5&error=true`);
  }

  const primaryMember = await getMembershipMembers(quote.memberships.id).then((members) =>
    members?.find((member) => member.is_primary),
  );

  if (!primaryMember) {
    redirect(`${getURL(isAfrica ? '/africa' : '')}/?step=5&error=true`);
  }

  try {
    // Update membership with user_id if not set
    // if (!quote.memberships.user_id) {
    //   const { error: membershipError } = await supabaseAdminClient
    //     .from('memberships')
    //     .update({ user_id: user.id })
    //     .eq('id', quote.memberships.id);

    //   if (membershipError) {
    //     console.error('Failed to update membership with user ID:', membershipError);
    //     throw Error('Failed to update membership');
    //   }
    // }

    const tx = await supabaseAdminClient.from('stripe_payments').select('*').eq('quote_id', quote.id).single();

    if (tx.data) {
      if (quote.memberships.status !== 'draft' && tx.data.status === 'paid') {
        return {
          success: true,
          url: `${getURL(isAfrica ? '/africa' : '')}/success?quoteId=${quote.id}&sessionId=${tx.data.session_id}`,
        };
      }
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
        // userId: user.id,
      },
      line_items: [
        {
          price_data: {
            currency: quote.currency,
            product_data: {
              name: 'Asketi Membership',
              description: `Membership Type: ${MEMBERSHIP_TYPES[quote.memberships.membership_type as keyof typeof MEMBERSHIP_TYPES]} |
              Coverage Type: ${COVERAGE_TYPES[quote.memberships.coverage_type as keyof typeof COVERAGE_TYPES]} |
              Duration Type: ${getDurationDetails(quote.memberships.duration_type).title}`,
            },
            unit_amount: Math.round(quote.total_price_with_tax * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${getURL(isAfrica ? '/africa' : '')}/success?quoteId=${quote.id}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getURL(isAfrica ? '/africa' : '')}/?step=5&error=true`,
    });

    if (!checkoutSession || !checkoutSession.url) {
      throw Error('checkoutSession is not defined');
    }

    await logOperation({
      level: 'info',
      operation: 'create_checkout_action',
      details: { checkoutSession },
    });

    return { success: true, url: checkoutSession.url };
  } catch (error) {
    await logOperation({
      level: 'error',
      operation: 'create_checkout_action',
      error: error as Error,
      details: { quote },
    });
    console.error('Error creating checkout:', error);
    return {
      success: false,
      error: 'Failed to create checkout',
    };
  }
}
