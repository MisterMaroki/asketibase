'use client';

import { useEffect } from 'react';

import { LoadingState } from '@/features/membership/components/LoadingState';
import { MembershipForm } from '@/features/membership/components/MembershipForm';
import { useHydration } from '@/hooks/use-hydration';
import { useMembershipStore } from '@/store/membership-store';

export default function MembershipPage() {
  const isHydrated = useHydration();
  useEffect(() => {
    useMembershipStore.persist.rehydrate();
  }, []);

  if (!isHydrated) {
    return <LoadingState />;
  }

  return <MembershipForm />;
}
