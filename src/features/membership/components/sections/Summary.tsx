'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMembershipStore } from '@/store/membership-store';

import { MembershipOverview } from './summary/MembershipOverview';
import { QuoteGenerator, QuoteType } from './summary/QuoteGenerator';

export function Summary() {
  const { members, setStep, setQuoteId } = useMembershipStore();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteType | null>(null);

  const handleQuoteGenerated = (quote: QuoteType | null) => {
    setQuote(quote);
    setQuoteId(quote?.id || null);
  };

  const handleEditQuote = () => {
    setQuote(null);
    setQuoteId(null);
  };

  useEffect(() => {
    if (members.length === 0) {
      router.replace('/?step=1');
      // setStep(1);
    }
  }, [members, router, setStep]);

  return (
    <div className='space-y-6'>
      <MembershipOverview quote={quote} />
      <QuoteGenerator onQuoteGenerated={handleQuoteGenerated} quote={quote} onPressEdit={handleEditQuote} />
    </div>
  );
}
