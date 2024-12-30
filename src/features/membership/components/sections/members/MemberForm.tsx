'use client';

import { useToast } from '@/components/ui/use-toast';
import type { MemberSchema } from '@/features/membership/validations/schemas';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { MemberFormFields } from './MemberFormFields';

interface MemberFormProps {
  id?: string;
  existingMember?: MemberSchema;
  onSubmit?: (data: MemberSchema) => void;
  onFieldChange?: (field: string, value: any) => void;
  showSubmitButton?: boolean;
}

export function MemberForm({ id, existingMember, onSubmit, onFieldChange, showSubmitButton = true }: MemberFormProps) {
  const { addMember, updateMember } = useMembershipStore();
  const { countries, isLoading: loadingCountries } = useCountries();
  const { toast } = useToast();

  const handleSubmit = (data: MemberSchema) => {
    if (existingMember?.id) {
      updateMember(existingMember.id, data);
      toast({
        title: 'Member updated',
        description: 'Member updated successfully',
      });
    } else {
      addMember(data);
      toast({
        title: 'Member added',
        description: 'Member added successfully',
      });
    }

    onSubmit?.(data);
  };

  return (
    <div>
      <MemberFormFields
        id={id}
        member={existingMember}
        onSubmit={handleSubmit}
        onFieldChange={onFieldChange}
        countries={countries}
        isLoadingCountries={loadingCountries}
        showSubmitButton={showSubmitButton}
      />
    </div>
  );
}
