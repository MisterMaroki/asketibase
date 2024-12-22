'use client';

import { useState } from 'react';

import type { MemberSchema } from '@/features/membership/validations/schemas';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { MemberFormFields } from './MemberFormFields';

interface MemberFormProps {
  existingMember?: MemberSchema;
  onSubmit?: () => void;
}

export function MemberForm({ existingMember, onSubmit }: MemberFormProps) {
  const { addMember, updateMember, membershipType, members } = useMembershipStore();
  const { countries, isLoading: loadingCountries } = useCountries();

  const [currentMember, setCurrentMember] = useState<MemberSchema | null>(existingMember || null);

  const handleFieldChange = (field: string, value: any) => {
    const memberData = { ...currentMember, [field]: value };
    setCurrentMember(memberData as any);
  };

  const handleSubmit = () => {
    console.log('🚀 ~ handleSubmit ~ existingMember?.id:', existingMember?.id);
    if (existingMember?.id) {
      updateMember(existingMember.id, currentMember as any);
    } else {
      addMember(currentMember as any);
      setCurrentMember(null);
    }

    onSubmit?.();
  };

  return (
    <div>
      <MemberFormFields
        member={currentMember}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        countries={countries}
        isLoadingCountries={loadingCountries}
        showSubmitButton
      />
    </div>
  );
}
