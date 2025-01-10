'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { logOperation } from '@/features/membership/actions/log-action';
import { MEDICAL_DISCLAIMER } from '@/libs/membership/eligibility';
import { useMembershipStore } from '@/store/membership-store';

export function EligibilityConfirmation({ hideOn }: { hideOn: 'md' | 'sm' }) {
  const router = useRouter();
  const { eligibilityAccepted, setEligibility, setStep } = useMembershipStore();

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
      setStep(2);
      // router.push('/?step=2');
    } catch (error) {
      console.error('Failed to log eligibility acceptance:', error);
      // Continue with navigation even if logging fails
      setEligibility(true);
      setStep(2);
      // router.push('/?step=2');
    }
  };

  const handleCheckboxChange = async (checked: boolean) => {
    setEligibility(checked);
    try {
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
    }
  };

  return (
    <div className={`space-y-6 ${hideOn === 'md' ? 'block md:hidden' : hideOn === 'sm' ? 'hidden sm:block' : ''}`}>
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
        <Checkbox
          id='eligibility'
          checked={eligibilityAccepted}
          onCheckedChange={handleCheckboxChange}
          className='mt-1'
        />
        <Label htmlFor='eligibility' className='cursor-pointer text-sm leading-relaxed'>
          I confirm that I have read, understood, and meet the eligibility requirements and medical disclaimers stated
          above.
        </Label>
      </div>

      <Button onClick={handleContinue} disabled={!eligibilityAccepted} className='w-full py-5'>
        Continue to Membership Details
      </Button>
    </div>
  );
}
