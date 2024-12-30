'use client';

import { useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { isMemberValid } from '@/features/membership/validations/member-fields';
import type { MemberSchema } from '@/features/membership/validations/schemas';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { MemberFormFields } from './MemberFormFields';

interface MemberFormProps {
  existingMember?: MemberSchema;
  onSubmit?: () => void;
}

export function MemberForm({ existingMember, onSubmit }: MemberFormProps) {
  const { addMember, updateMember } = useMembershipStore();
  const { countries, isLoading: loadingCountries } = useCountries();
  const { toast } = useToast();

  const [currentMember, setCurrentMember] = useState<MemberSchema | null>(existingMember || null);

  const handleFieldChange = (field: string, value: any) => {
    const memberData = { ...currentMember, [field]: value };
    setCurrentMember(memberData as any);
  };

  const handleSubmit = () => {
    if (!currentMember) return;
    const valid = isMemberValid(currentMember);
    if (!valid) return;

    if (existingMember?.id) {
      updateMember(existingMember.id, currentMember as any);
      toast({
        title: 'Member updated',
        description: 'Member updated successfully',
      });
    } else {
      addMember(currentMember as any);
      toast({
        title: 'Member added',
        description: 'Member added successfully',
      });
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
