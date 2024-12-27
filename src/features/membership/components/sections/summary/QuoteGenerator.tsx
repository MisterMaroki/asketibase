'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import QuoteSummary from '@/components/QuoteSummary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { createCheckoutAction } from '@/features/membership/actions/create-checkout-action';
import { generateQuoteAction } from '@/features/membership/actions/generate-quote';
import { getApplicationValidationErrors, isApplicationValid } from '@/features/membership/validations/membership';
import { MemberSchema } from '@/features/membership/validations/schemas';
import { useMembershipStore } from '@/store/membership-store';

interface QuoteType {
  id: string;
  currency: string;
  coverageType: string;
  duration: string;
  startDate: string;
  endDate: string;
  members: Array<{
    memberId: string;
    countryPrice: number;
    ageFactor: number;
    name: string;
    coverageFactor: number;
    medicalFactor: number;
    dailyTotal: number;
    total: number;
    isPrimary: boolean;
  }>;
  totalPremium: number;
  taxAmount: number;
  discountApplied: number;
  finalPremium: number;
}

export function QuoteGenerator() {
  const [quote, setQuote] = useState<QuoteType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
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
  // Prepare membership data for validation
  const membershipData = {
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

  const validationErrors = getApplicationValidationErrors(membershipData as any);
  const canContinue = isApplicationValid(membershipData as any);

  useEffect(() => {
    if (errorParam) {
      // Wait for next tick to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [errorParam]);

  const handleGenerateQuote = async () => {
    if (quote) {
      setIsLoading(true);
      setError(null);
      try {
        await createCheckoutAction(quote.id);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to process your membership');
      } finally {
        setIsLoading(false);
        return;
      }
    }
    try {
      setIsLoading(true);
      setError(null);
      setQuote(null);

      // Clear error param from URL without refresh
      if (errorParam) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('error');
        router.replace(newUrl.pathname + newUrl.search, { scroll: false });
      }

      // Generate quote
      const quote = await generateQuoteAction({
        membershipType: membershipType!,
        coverageType: coverageType!,
        durationType: durationType!,
        startDate: startDate!,
        endDate: endDate!,
        currency: currency!,
        members: members.map((member, i) => ({ ...member, isPrimary: i === 0 })) as MemberSchema[],
        referralCode,
        referralSource,
        medicalState,
      });

      if (quote) {
        console.log('🚀 ~ handleGenerateQuote ~ quote:', quote);

        setQuote(quote);

        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      } else {
        throw new Error('Failed to generate quote');
      }
    } catch (err) {
      console.error('Failed to process membership:', err);
      setError(err instanceof Error ? err.message : 'Failed to process your membership');
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
          <QuoteSummary {...quote} />
        </div>
      )}

      <div className='mt-8 flex flex-col justify-end gap-4 '>
        {errorParam && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>There was an error processing your payment. Please try again.</AlertDescription>
          </Alert>
        )}
        {/* {quote ? (
          <CheckoutForm id={quote.id} />
        ) : ( */}
        <Button onClick={handleGenerateQuote} disabled={!canContinue || isLoading} className='w-full '>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {quote ? 'Loading Stripe Checkout...' : 'Processing...'}
            </>
          ) : quote ? (
            'Checkout in Stripe'
          ) : (
            'Generate Quote'
          )}
        </Button>
        {/* )} */}
      </div>
    </div>
  );
}
