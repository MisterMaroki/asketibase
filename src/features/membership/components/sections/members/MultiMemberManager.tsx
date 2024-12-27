'use client';

import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MEMBER_LIMITS } from '@/constants/membership';
import { isMemberValid } from '@/features/membership/validations/member-fields';
import { useMembershipStore } from '@/store/membership-store';

import { MemberForm } from './MemberForm';
import { MemberList } from './MemberList';

export function MultiMemberManager() {
  const { membershipType, members } = useMembershipStore();
  console.log('🚀 ~ MultiMemberManager ~ members:', members);

  if (!membershipType) return null;

  const maxMembers = MEMBER_LIMITS[membershipType];
  const showAddMember = members.length < maxMembers && members.every(isMemberValid);

  return (
    <div className='space-y-6'>
      <MemberList />

      {showAddMember && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5 text-primary' />
              Add Member ({members.length + 1}/{maxMembers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemberForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
