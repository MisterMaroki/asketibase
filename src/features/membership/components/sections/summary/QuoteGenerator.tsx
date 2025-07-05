'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';

import QuoteSummary from '@/components/QuoteSummary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { createCheckoutAction } from '@/features/membership/actions/create-checkout-action';
import { generateQuoteAction } from '@/features/membership/actions/generate-quote';
import { loadQuoteAction } from '@/features/membership/actions/load-quote';
import { getApplicationValidationErrors, isApplicationValid } from '@/features/membership/validations/membership';
import { MemberSchema } from '@/features/membership/validations/schemas';
import { useMembershipStore } from '@/store/membership-store';

import { BenefitsTable } from './BenefitsTable';

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
    sessionId,
    affiliateCode,
    setReferralCode,
    setReferralSource,
    setAffiliateCode,
  } = useMembershipStore();
  const router = useRouter();
  const pathname = usePathname();

  const isAfrica = pathname.includes('/africa');

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

  // Handle discount code for WELCOME10 from URL params
  useEffect(() => {
    const code = searchParams.get('code');

    if (code === 'WELCOME10' && code !== referralCode) {
      const applyDiscountCode = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // First set the referral code
          setReferralCode(code);

          // Wait a bit for the code to be validated
          await new Promise((resolve) => setTimeout(resolve, 800));

          // If we have all necessary data, generate a new quote
          if (membershipType && coverageType && durationType && startDate && currency && members && sessionId) {
            // Clear existing quote
            onQuoteGenerated(null);
            setQuoteId(null);

            // Generate new quote with discount code
            const newQuote = await generateQuoteAction({
              sessionId,
              membershipType,
              coverageType,
              durationType,
              startDate,
              endDate,
              currency,
              members: members.map((member, i) => ({ ...member, isPrimary: i === 0 })) as MemberSchema[],
              referralCode: code,
              referralSource,
              affiliateCode,
              medicalState,
              projectCode: isAfrica ? 'africa' : 'main',
            });

            if (!newQuote.success || !newQuote.data) {
              throw new Error('Failed to generate quote with discount code');
            }

            setQuoteId(newQuote.data.id);
            onQuoteGenerated(newQuote.data);
          }

          // Clean up the URL without refreshing the page
          const params = new URLSearchParams(searchParams);
          params.delete('code');
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } catch (err) {
          console.error('Failed to apply discount code:', err);
          setError(err instanceof Error ? err.message : 'Failed to apply discount code');
        } finally {
          setIsLoading(false);
        }
      };

      applyDiscountCode();
    }
  }, [searchParams]);

  useEffect(() => {
    const source = searchParams.get('source');

    if (source && source !== referralSource) {
      const applyDiscountCode = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // First set the referral code
          setReferralSource(source);

          // Wait a bit for the code to be validated
          await new Promise((resolve) => setTimeout(resolve, 800));

          // If we have all necessary data, generate a new quote
          if (membershipType && coverageType && durationType && startDate && currency && members && sessionId) {
            // Clear existing quote
            onQuoteGenerated(null);
            setQuoteId(null);

            // Generate new quote with discount code
            const newQuote = await generateQuoteAction({
              sessionId,
              membershipType,
              coverageType,
              durationType,
              startDate,
              endDate,
              currency,
              members: members.map((member, i) => ({ ...member, isPrimary: i === 0 })) as MemberSchema[],
              referralCode,
              referralSource: source,
              affiliateCode,
              medicalState,
              projectCode: isAfrica ? 'africa' : 'main',
            });

            if (!newQuote.success || !newQuote.data) {
              throw new Error('Failed to generate quote with source');
            }

            setQuoteId(newQuote.data.id);
            onQuoteGenerated(newQuote.data);
          }

          // Clean up the URL without refreshing the page
          const params = new URLSearchParams(searchParams);
          params.delete('source');
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } catch (err) {
          console.error('Failed to apply source:', err);
          setError(err instanceof Error ? err.message : 'Failed to apply source');
        } finally {
          setIsLoading(false);
        }
      };

      applyDiscountCode();
    }
  }, [searchParams]);

  // affiliate code
  useEffect(() => {
    const code = searchParams.get('affiliate');

    if (code && code !== affiliateCode) {
      const applyDiscountCode = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // First set the referral code
          setAffiliateCode(code);

          // Wait a bit for the code to be validated
          await new Promise((resolve) => setTimeout(resolve, 800));

          // If we have all necessary data, generate a new quote
          if (membershipType && coverageType && durationType && startDate && currency && members && sessionId) {
            // Clear existing quote
            onQuoteGenerated(null);
            setQuoteId(null);

            // Generate new quote with discount code
            const newQuote = await generateQuoteAction({
              sessionId,
              membershipType,
              coverageType,
              durationType,
              startDate,
              endDate,
              currency,
              members: members.map((member, i) => ({ ...member, isPrimary: i === 0 })) as MemberSchema[],
              referralCode,
              referralSource,
              affiliateCode: code,
              medicalState,
              projectCode: isAfrica ? 'africa' : 'main',
            });

            if (!newQuote.success || !newQuote.data) {
              throw new Error('Failed to generate quote with source');
            }

            setQuoteId(newQuote.data.id);
            onQuoteGenerated(newQuote.data);
          }

          // Clean up the URL without refreshing the page
          const params = new URLSearchParams(searchParams);
          params.delete('source');
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } catch (err) {
          console.error('Failed to apply source:', err);
          setError(err instanceof Error ? err.message : 'Failed to apply source');
        } finally {
          setIsLoading(false);
        }
      };

      applyDiscountCode();
    }
  }, [searchParams]);

  const clearErrorParam = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('error');
    router.replace(newUrl.pathname + newUrl.search, { scroll: false });
  };

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    setError(null);
    // Clear error param from URL without refresh
    if (quote) {
      try {
        const result = await createCheckoutAction(quote.id, isAfrica);
        if (result.success && result.url) {
          window.location.href = result.url;
          setIsLoading(false);
          return;
        }
        if (result.error) {
          throw new Error(result.error);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('No user')) {
          // setShowAuthModal(true);
          setIsLoading(false);
          return;
        }
        setError(error instanceof Error ? error.message : 'Failed to process your membership');
        setIsLoading(false);
        return;
      }
      return;
    }

    onQuoteGenerated(null);
    setQuoteId(null);

    if (errorParam) {
      clearErrorParam();
    }

    try {
      if (!coverageType || !durationType || !membershipType || !startDate || !currency || !members || !sessionId) {
        throw new Error('Missing required fields');
      }
      // Generate quote
      const quote = await generateQuoteAction({
        sessionId,
        membershipType,
        coverageType,
        durationType,
        startDate,
        endDate,
        currency,
        members: members.map((member, i) => ({ ...member, isPrimary: i === 0 })) as MemberSchema[],
        referralCode,
        referralSource,
        affiliateCode,
        medicalState,
        projectCode: isAfrica ? 'africa' : 'main',
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

  // const handleAuthSuccess = async () => {
  //   if (quoteId) {
  //     try {
  //       setIsLoading(true);
  //       await createCheckoutAction(quoteId);
  //     } catch (error) {
  //       setError(error instanceof Error ? error.message : 'Failed to process your membership');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

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

      <BenefitsTable />

      {quote && (
        <div className='mt-8'>
          <QuoteSummary
            {...quote}
            onPressEdit={() => {
              onPressEdit();
              clearErrorParam();
            }}
          />
        </div>
      )}

      <div className='mt-8 flex flex-col justify-end gap-4'>
        {/* Trust Building Elements */}
        {quote && (
          <div className='space-y-6 rounded-lg border border-border bg-card p-6'>
            {/* Company Info and Certifications */}
            <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
              {/* Company Details */}
              <div className='space-y-2'>
                <h3 className='flex items-center gap-2 font-semibold'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='mr-2 h-4 w-4'
                  >
                    <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />

                    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                  </svg>
                  ASKETI Global Travel Protection
                </h3>
              </div>

              {/* Trust Badges */}
              <div className='flex flex-wrap items-center gap-6'>
                {/* Secure Payment Badge */}
                <div className='flex flex-col items-center gap-1.5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-green-600'
                  >
                    <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
                    <path d='m9 12 2 2 4-4' />
                  </svg>
                  <div className='text-center'>
                    <p className='text-xs font-medium'>Secure Payment</p>
                    <p className='text-[10px] text-muted-foreground'>256-bit SSL Encryption</p>
                  </div>
                </div>

                {/* 24/7 Support Badge */}
                <div className='flex flex-col items-center gap-1.5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-red-600'
                  >
                    <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                  </svg>
                  <div className='text-center'>
                    <p className='text-xs font-medium'>24/7 Global Support</p>
                    <p className='text-[10px] text-muted-foreground'>Emergency Response</p>
                  </div>
                </div>

                {/* Instant Coverage Badge */}
                <div className='flex flex-col items-center gap-1.5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-yellow-600'
                  >
                    <path d='M12 2v8' />
                    <path d='m4.93 10.93 1.41 1.41' />
                    <path d='M2 18h2' />
                    <path d='M20 18h2' />
                    <path d='m19.07 10.93-1.41 1.41' />
                    <path d='M22 22H2' />
                    <path d='m16 6-4 4-4-4' />
                    <path d='M16 18a4 4 0 0 0-8 0' />
                  </svg>
                  <div className='text-center'>
                    <p className='text-xs font-medium'>Instant Coverage</p>
                    <p className='text-[10px] text-muted-foreground'>Immediate Protection</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='h-px w-full bg-border' />

            {/* Bottom Section */}
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              {/* Legal Links */}
              <div className='flex flex-wrap gap-x-6 gap-y-2 text-sm'>
                <a href='https://www.asketi.com/terms-of-use' className='text-primary hover:underline'>
                  Terms & Conditions
                </a>
                <a href='https://www.asketi.com/privacy-policy' className='text-primary hover:underline'>
                  Privacy Policy
                </a>
                <a href='https://www.asketi.com/privacy-policy-1' className='text-primary hover:underline'>
                  Slavery and Human Trafficking
                </a>
              </div>

              {/* Powered by Stripe */}
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span>Powered by</span>
                <svg
                  viewBox='0 0 60 25'
                  xmlns='http://www.w3.org/2000/svg'
                  width='60'
                  height='25'
                  className='fill-current'
                >
                  <path
                    d='M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z'
                    fillRule='evenodd'
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        )}

        {(errorParam || error) && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {error
                ? (error as unknown as FieldError)?.message || error
                : 'There was an error processing your payment. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleGenerateQuote} disabled={!canContinue || isLoading} className='w-full'>
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              {quote ? 'Loading Stripe Checkout...' : 'Processing...'}
            </>
          ) : quote ? (
            <>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2 h-4 w-4'
              >
                <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0 1 10 0v4' />
              </svg>
              Secure Checkout
            </>
          ) : (
            'Generate Quote'
          )}
        </Button>
      </div>

      {/* <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode='signup'
      /> */}
    </div>
  );
}
