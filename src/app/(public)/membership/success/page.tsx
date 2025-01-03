'use server';
import { redirect } from 'next/navigation';

import { handlePaid } from '@/features/membership/actions/handle-paid';
import { DocumentGenerator } from '@/features/membership/components/DocumentGenerator';
import { getStripeSession } from '@/features/membership/controllers/get-stripe-session';
import { getQuoteWithMembership } from '@/features/membership/controllers/quote-memberships';

export default async function MembershipSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ quoteId: string; sessionId: string }>;
}) {
  const { quoteId, sessionId } = await searchParams;

  if (!quoteId || !sessionId) {
    redirect('/');
  }

  const quote = await getQuoteWithMembership(quoteId);
  if (!quote) {
    redirect('/membership?step=5');
  }

  const checkoutSession = await getStripeSession(sessionId);
  if (!checkoutSession) {
    redirect('/membership?step=5&error=true');
  }

  const res = await handlePaid(checkoutSession);
  if (!res) {
    redirect('/membership?step=5&error=true');
  }

  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
      {/* <Card className='p-8' > */}
      <div className='flex flex-col items-center justify-center space-y-6'>
        <DocumentGenerator quoteId={quoteId} hasSentEmail={['active', 'sent'].includes(quote.memberships.status)} />
      </div>
      {/* </Card> */}
    </div>
  );
}
