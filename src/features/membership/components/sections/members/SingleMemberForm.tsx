'use client';

import { useState } from 'react';
import { UserCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { MemberFormFields } from './MemberFormFields';
import { MemberFormValidation } from './MemberFormValidation';

export function SingleMemberForm() {
  const { members, addMember, updateMember } = useMembershipStore();
  const { countries, isLoading: loadingCountries } = useCountries();
  const [showErrors, setShowErrors] = useState(false);
  const existingMember = members[0];
  const { toast } = useToast();
  const handleFieldChange = (field: string, value: any) => {
    // console.log('🚀 ~ handleFieldChange ~ field, value:', field, value);
    const memberData = existingMember
      ? { ...existingMember, [field]: value }
      : { id: crypto.randomUUID(), [field]: value };

    if (existingMember) {
      updateMember(existingMember.id, memberData);
      toast({
        title: 'Member updated',
        description: 'Member updated successfully',
      });
    } else {
      addMember(memberData as any);
      toast({
        title: 'Member added',
        description: 'Member added successfully',
      });
    }

    // Show validation after first attempt to continue
    if (showErrors) {
      setShowErrors(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UserCircle className='h-5 w-5 text-primary' />
          Your Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MemberFormFields
          member={existingMember}
          onFieldChange={handleFieldChange}
          countries={countries}
          isLoadingCountries={loadingCountries}
        />
        <MemberFormValidation member={existingMember || {}} showErrors={showErrors} />
      </CardContent>
    </Card>
  );
}
