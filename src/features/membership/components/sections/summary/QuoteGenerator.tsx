'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import { AuthModal } from '@/components/auth-modal';
import QuoteSummary from '@/components/QuoteSummary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { createCheckoutAction } from '@/features/membership/actions/create-checkout-action';
import { generateQuoteAction } from '@/features/membership/actions/generate-quote';
import { loadQuoteAction } from '@/features/membership/actions/load-quote';
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
  referralCode: string;
  finalPremium: number;
}

export type { QuoteType };

export function QuoteGenerator({
  onQuoteGenerated,
  quote,
  onPressEdit,
}: {
  onQuoteGenerated: (quote: QuoteType | null) => void;
  quote: QuoteType | null;
  onPressEdit: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    quoteId,
    setQuoteId,
  } = useMembershipStore();
  const router = useRouter();

  // Load quote from quoteId if available
  useEffect(() => {
    if (quoteId && !quote) {
      const loadQuote = async () => {
        try {
          setIsLoading(true);
          const loadedQuote = await loadQuoteAction(quoteId);
          if (loadedQuote) {
            onQuoteGenerated(loadedQuote);
          } else {
            // If quote couldn't be loaded, clear the ID from store
            setQuoteId(null);
          }
        } catch (err) {
          console.error('Failed to load quote:', err);
          setError('Failed to load quote');
          setQuoteId(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadQuote();
    }
  }, [quoteId, quote, onQuoteGenerated, setQuoteId]);

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
        const result = await createCheckoutAction(quote.id);
        if (result.success && result.url) {
          window.location.href = result.url;
          return;
        }
        if (result.error) {
          throw new Error(result.error);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('No user')) {
          setShowAuthModal(true);
          setIsLoading(false);
          return;
        }
        setError(error instanceof Error ? error.message : 'Failed to process your membership');
        setIsLoading(false);
        return;
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    onQuoteGenerated(null);
    setQuoteId(null);

    // Clear error param from URL without refresh
    if (errorParam) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }

    try {
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

      if (!quote.success || !quote.data) {
        throw new Error('Failed to generate quote');
      }

      setQuoteId(quote.data.id);
      onQuoteGenerated(quote.data);

      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    } catch (err) {
      console.error('Failed to process membership:', err);
      setError(err instanceof Error ? err.message : 'Failed to process your membership');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async () => {
    if (quoteId) {
      try {
        setIsLoading(true);
        await createCheckoutAction(quoteId);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to process your membership');
      } finally {
        setIsLoading(false);
      }
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
          <QuoteSummary {...quote} onPressEdit={onPressEdit} />
        </div>
      )}

      <div className='mt-8 flex flex-col justify-end gap-4'>
        {errorParam && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>There was an error processing your payment. Please try again.</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleGenerateQuote} disabled={!canContinue || isLoading} className='w-full'>
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
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode='signup'
      />
    </div>
  );
}
