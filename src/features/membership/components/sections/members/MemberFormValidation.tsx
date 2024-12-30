'use client';

import { AlertCircle } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { getMemberValidationErrors } from '@/features/membership/validations/member-fields';
import type { Member } from '@/store/membership-store';

interface MemberFormValidationProps {
  member: Partial<Member>;
  showErrors?: boolean;
}

export function MemberFormValidation({ member, showErrors = false }: MemberFormValidationProps) {
  const errors = getMemberValidationErrors(member);

  if (!showErrors || errors.length === 0) return null;

  return (
    <Alert variant='destructive' className='mt-4'>
      <AlertCircle className='h-4 w-4' />
      <AlertDescription>
        <ul className='list-disc space-y-1 pl-4'>
          {errors.map((error, index) => (
            <li key={index}>{(error as unknown as FieldError)?.message || error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
