'use client';

import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import QuoteSummary from '@/components/QuoteSummary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { generateQuoteAction } from '@/features/membership/actions/generate-quote';
import { getApplicationValidationErrors, isApplicationValid } from '@/features/membership/validations/application';
import { MemberSchema } from '@/features/membership/validations/schemas';
import { createCheckoutAction } from '@/features/pricing/actions/create-checkout-action';
import { Price } from '@/features/pricing/types';
// import { createApplication } from '@/lib/applications/service';
// import { fetchQuoteDetails } from '@/lib/quotes/fetch';
// import { generateQuote } from '@/lib/quotes/service';
// import { registerPrimaryMember } from '@/lib/users/service';
import { useMembershipStore } from '@/store/membership-store';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// function CheckoutForm({ id }: { id: string }) {

//   return (
//     <form action={createCheckoutAction} method='POST'>
//       <section>
//         <button type='submit' role='link'>
//           Checkout
//         </button>
//       </section>
//       <style jsx>
//         {`
//           section {
//             background: #ffffff;
//             display: flex;
//             flex-direction: column;
//             width: 400px;
//             height: 112px;
//             border-radius: 6px;
//             justify-content: space-between;
//           }
//           button {
//             height: 36px;
//             background: #556cd6;
//             border-radius: 4px;
//             color: white;
//             border: 0;
//             font-weight: 600;
//             cursor: pointer;
//             transition: all 0.2s ease;
//             box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
//           }
//           button:hover {
//             opacity: 0.8;
//           }
//         `}
//       </style>
//     </form>
//   );
// }
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
  }>;
  totalPremium: number;
  discountApplied: number;
  finalPremium: number;
}

export function QuoteGenerator() {
  const [quote, setQuote] = useState<QuoteType | null>(null);
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
    if (quote) {
      await createCheckoutAction(quote.id);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      setQuote(null);

      // // Generate quote
      const quote = await generateQuoteAction({
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
        console.log('🚀 ~ handleGenerateQuote ~ quote:', quote);
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
          <QuoteSummary {...quote} />
        </div>
      )}

      <div className='mt-8 flex justify-end space-x-4'>
        {/* {quote ? (
          <CheckoutForm id={quote.id} />
        ) : ( */}
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
        {/* )} */}
      </div>
    </div>
  );
}
