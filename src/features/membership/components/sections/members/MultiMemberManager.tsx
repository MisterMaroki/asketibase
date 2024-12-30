'use client';

import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMembershipStore } from '@/store/membership-store';

import { MemberList } from './MemberList';

export function MultiMemberManager() {
  const { membershipType } = useMembershipStore();

  if (!membershipType) return null;

  return (
    <div className='space-y-6'>
      <MemberList />
    </div>
  );
}
