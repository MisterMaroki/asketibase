'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { generateQuoteAction } from '@/features/membership/actions/generate-quote';
import { getApplicationValidationErrors, isApplicationValid } from '@/features/membership/validations/application';
import { MemberSchema } from '@/features/membership/validations/schemas';
// import { createApplication } from '@/lib/applications/service';
// import { fetchQuoteDetails } from '@/lib/quotes/fetch';
// import { generateQuote } from '@/lib/quotes/service';
// import { registerPrimaryMember } from '@/lib/users/service';
import { useMembershipStore } from '@/store/membership-store';

import { PricingSummary } from './PricingSummary';

export function QuoteGenerator() {
  const [quote, setQuote] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    membershipType,
    coverageType,
    durationType,
    currency,
    startDate,
    endDate,
    members,
    referralCode,
    referralSource,
    medicalState,
    setStep,
  } = useMembershipStore();
  const router = useRouter();
  // Prepare application data for validation
  const applicationData = {
    membershipType,
    coverageType,
    durationType,
    currency,
    startDate,
    endDate,
    members,
    referralCode,
    referralSource,
  };

  const validationErrors = getApplicationValidationErrors(applicationData as any);
  const canContinue = isApplicationValid(applicationData as any);

  const handleGenerateQuote = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setQuote(null);

      // // Generate quote
      const { quote } = await generateQuoteAction({
        membershipType: membershipType!,
        coverageType: coverageType!,
        durationType: durationType!,
        startDate: startDate!,
        endDate: endDate!,
        currency: currency!,
        members: members as MemberSchema[],
        referralCode,
        referralSource,
        medicalState,
      });

      if (quote) {
        setQuote(quote);
      } else {
        throw new Error('Failed to generate quote');
      }
    } catch (err) {
      console.error('Failed to process application:', err);
      setError(err instanceof Error ? err.message : 'Failed to process your application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {validationErrors.length > 0 && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            <ul className='list-disc space-y-1 pl-4'>
              {validationErrors.map((error, index) => (
                <li key={index}>{(error as unknown as FieldError)?.message || error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{(error as unknown as FieldError)?.message || error}</AlertDescription>
        </Alert>
      )}

      {quote && (
        <div className='mt-8'>
          <PricingSummary quote={quote} />
          <div className='mt-4 flex justify-end'>
            <Button className='min-w-[200px]'>Proceed to Payment</Button>
          </div>
        </div>
      )}

      <div className='mt-8 flex justify-end space-x-4'>
        <Button onClick={handleGenerateQuote} disabled={!canContinue || isLoading} className='min-w-[200px]'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            'Generate Quote'
          )}
        </Button>
      </div>
    </div>
  );
}
