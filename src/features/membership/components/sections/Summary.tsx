'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useMembershipStore } from '@/store/membership-store';

import { MembershipOverview } from './summary/MembershipOverview';
import { QuoteGenerator } from './summary/QuoteGenerator';

export function Summary() {
  const { members, setStep } = useMembershipStore();
  const router = useRouter();

  useEffect(() => {
    if (members.length === 0) {
      router.replace('/membership?step=1');
      // setStep(1);
    }
  }, [members, router, setStep]);

  return (
    <div className='space-y-6'>
      <MembershipOverview />
      <QuoteGenerator />
    </div>
  );
}
