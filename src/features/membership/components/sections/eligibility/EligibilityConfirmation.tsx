'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { logOperation } from '@/features/membership/actions/log-action';
import { MEDICAL_DISCLAIMER } from '@/libs/membership/eligibility';
import { useMembershipStore } from '@/store/membership-store';

export function EligibilityConfirmation() {
  const router = useRouter();
  const { setEligibility, setStep } = useMembershipStore();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = async () => {
    try {
      await logOperation({
        level: 'info',
        operation: 'accept_eligibility',
        details: {
          timestamp: new Date().toISOString(),
          accepted: true,
          page: 'membership',
          section: 'eligibility',
        },
      });

      setEligibility(true);
      // setStep(2);
      router.push('/membership?step=2');
    } catch (error) {
      console.error('Failed to log eligibility acceptance:', error);
      // Continue with navigation even if logging fails
      setEligibility(true);
      // setStep(2);
      router.push('/membership?step=2');
    }
  };

  const handleCheckboxChange = async (checked: boolean) => {
    try {
      setAccepted(checked);
      if (checked) {
        await logOperation({
          level: 'info',
          operation: 'check_eligibility',
          details: {
            timestamp: new Date().toISOString(),
            page: 'membership',
            section: 'eligibility',
          },
        });
      }
    } catch (error) {
      console.error('Failed to log checkbox change:', error);
      // Continue with state update even if logging fails
      setAccepted(checked);
    }
  };

  return (
    <div className='space-y-6'>
     

      <div className='overflow-hidden rounded-lg'>
        <div className='border-b border-destructive/20 bg-destructive/10 px-6 py-3'>
          <h3 className='flex items-center gap-2 font-medium text-destructive'>
            <AlertTriangle className='h-4 w-4' />
            Important Medical Disclaimer
          </h3>
        </div>
        <div className='border border-destructive/20 bg-destructive/5 p-6'>
          <p className='text-sm leading-relaxed text-destructive/90'>{MEDICAL_DISCLAIMER}</p>
        </div>
      </div>

      <div className='flex items-start space-x-3 rounded-lg bg-secondary/5 p-6'>
        <Checkbox id='eligibility' checked={accepted} onCheckedChange={handleCheckboxChange} className='mt-1' />
        <label htmlFor='eligibility' className='cursor-pointer text-sm leading-relaxed'>
          I confirm that I have read, understood, and agree to the eligibility requirements and medical disclaimers
          stated above.
        </label>
      </div>

      <Button onClick={handleContinue} disabled={!accepted} className='w-full py-5'>
        Continue to Membership Details
      </Button>
    </div>
  );
}
