'use client';

import { useEffect } from 'react';

import { LoadingState } from '@/features/membership/components/LoadingState';
import { MembershipForm } from '@/features/membership/components/MembershipForm';
import { createSession } from '@/features/membership/controllers/manage-session';
import { useHydration } from '@/hooks/use-hydration';
import { useMembershipStore } from '@/store/membership-store';

export default function MembershipPage() {
  const isHydrated = useHydration();
  const { setSessionId } = useMembershipStore();

  useEffect(() => {
    useMembershipStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    async function initSession() {
      try {
        const session = await createSession();
        if (session) {
          setSessionId(session.id);
        }
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    }

    if (isHydrated) {
      initSession();
    }
  }, [isHydrated, setSessionId]);

  if (!isHydrated) {
    return <LoadingState />;
  }

  return <MembershipForm />;
}
