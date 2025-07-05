'use client';

import { useEffect } from 'react';

import { LoadingState } from '@/features/membership/components/LoadingState';
import { MembershipForm } from '@/features/membership/components/MembershipForm';
import { createSession, getSession } from '@/features/membership/controllers/manage-session';
import { useHydration } from '@/hooks/use-hydration';
import { useMembershipStore } from '@/store/membership-store';

export default function MembershipPage() {
  const isHydrated = useHydration();
  const { sessionId, setSessionId, reset } = useMembershipStore();

  useEffect(() => {
    useMembershipStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    async function initSession() {
      try {
        // If we have a sessionId, check if it's still valid
        if (sessionId) {
          const existingSession = await getSession(sessionId);

          if (existingSession) {
            // Check if session is less than 24 hours old
            const sessionDate = new Date(existingSession.created_at);
            const now = new Date();
            const hoursDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
              // Session is still valid and has no completed memberships
              return;
            }
          }
          // Session is expired, has completed memberships, or doesn't exist
          // Reset the store to clear all existing data
          reset();
        }

        // Create new session
        const newSession = await createSession();
        if (newSession) {
          setSessionId(newSession.id);
        }
      } catch (error) {
        console.error('Failed to manage session:', error);
      }
    }

    if (isHydrated) {
      initSession();
    }
  }, [isHydrated, sessionId, setSessionId, reset]);

  if (!isHydrated) {
    return <LoadingState />;
  }

  return <MembershipForm />;
}
