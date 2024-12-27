import { stripeAdmin } from '@/libs/stripe/stripe-admin';

export async function getStripeSession(sessionId: string) {
  try {
    const checkoutSession = await stripeAdmin.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      throw Error('Could not get checkout session');
    }

    return checkoutSession;
  } catch (error) {
    console.error(error);
    return null;
  }
}
