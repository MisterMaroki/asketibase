'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useMembershipStore } from '@/store/membership-store';

import { CoverageOptions } from './details/CoverageOptions';
import { CurrencySection } from './details/CurrencySection';
import { DurationSection } from './details/DurationSection';

const RETURN_TO_SUMMARY_STEP = 5;

export function MembershipDetails() {
  const router = useRouter();
  const {
    setStep,
    durationType,
    startDate,
    removeUnnecessaryMembers,
    endDate,
    hasStateChanged,
    clearOriginalState,
    originalState,
    currency,
    coverageType,
  } = useMembershipStore();

  const canContinue = () => {
    if (!durationType) return false;
    if (!currency) return false;
    if (!coverageType) return false;
    // For single trip, require both start and end date
    if (durationType === 'single_trip') {
      return startDate && endDate;
    }

    // For other types, only start date is required
    return !!startDate;
  };

  const handleNext = () => {
    if (originalState && !hasStateChanged()) {
      // No changes made, return to summary
      clearOriginalState();
      removeUnnecessaryMembers();
      setStep(RETURN_TO_SUMMARY_STEP);
      // router.push(`/membership?step=${RETURN_TO_SUMMARY_STEP}`);
    } else {
      // Changes made or new flow, continue to members
      clearOriginalState();
      removeUnnecessaryMembers();
      // router.push('/membership?step=3');
      setStep(3);
    }
  };

  return (
    <div className='space-y-6'>
      <CurrencySection />
      <CoverageOptions />
      <DurationSection />

      <div className='mt-8 flex justify-end space-x-4'>
        <Button
          variant='outline'
          onClick={() => {
            // router.push('/membership?step=1');
            setStep(1);
          }}
          className='min-w-[100px]'
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!canContinue()} className='min-w-[100px]'>
          Continue
        </Button>
      </div>
    </div>
  );
}
