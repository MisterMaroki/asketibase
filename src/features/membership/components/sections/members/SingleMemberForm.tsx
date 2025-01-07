'use client';

import { UserCircle } from 'lucide-react';
import { nanoid } from 'nanoid';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { MemberFormFields } from './MemberFormFields';

export function SingleMemberForm() {
  const { members, addMember, updateMember } = useMembershipStore();
  const { countries, isLoading: loadingCountries } = useCountries();
  const existingMember = members[0];
  const { toast } = useToast();

  const handleFieldChange = (field: string, value: any) => {
    const memberData = existingMember ? { ...existingMember, [field]: value } : { id: nanoid(), [field]: value };

    if (existingMember) {
      updateMember(existingMember.id, memberData);
    } else {
      addMember(memberData as any);
    }
  };

  return (
    <Card className='mt-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UserCircle className='h-5 w-5 text-primary' />
          Your Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MemberFormFields
          member={existingMember as any}
          onFieldChange={handleFieldChange}
          countries={countries}
          isLoadingCountries={loadingCountries}
        />
      </CardContent>
    </Card>
  );
}
