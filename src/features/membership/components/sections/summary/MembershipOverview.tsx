'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Loader2, Pencil, Ticket } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REFERRAL_SOURCES, type ReferralSource } from '@/constants/membership';
import { MEMBER_LIMITS } from '@/constants/membership';
import { checkReferralCode } from '@/features/membership/controllers/check-referral-code';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { CoverageDetails } from './CoverageDetails';
import { MemberSummary } from './MemberSummary';
import { QuoteType } from './QuoteGenerator';

export function MembershipOverview({ quote }: { quote: QuoteType | null }) {
  const router = useRouter();
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validDiscount, setValidDiscount] = useState<number | null>(null);
  const {
    membershipType,
    coverageType,
    durationType,
    startDate,
    endDate,
    members,
    currency,
    referralCode,
    setReferralCode,
    referralSource,
    medicalState,
    setReferralSource,
    setStep,
    saveOriginalState,
  } = useMembershipStore();
  const [otherSpecification, setOtherSpecification] = useState(() => {
    // Initialize with current referral source if it's a custom value
    if (referralSource && !REFERRAL_SOURCES.includes(referralSource as ReferralSource)) {
      return referralSource;
    }
    return '';
  });

  useEffect(() => {
    const validateCode = async () => {
      if (!referralCode) {
        setValidDiscount(null);
        return;
      }

      setIsValidatingCode(true);
      try {
        const result = await checkReferralCode(referralCode);
        setValidDiscount(result?.discount_percent || null);
      } catch (error) {
        setValidDiscount(null);
      } finally {
        setIsValidatingCode(false);
      }
    };

    const debounceTimeout = setTimeout(validateCode, 600);
    return () => clearTimeout(debounceTimeout);
  }, [referralCode]);

  useEffect(() => {
    if (referralSource === 'Other (please specify)' && otherSpecification) {
      const debounceTimeout = setTimeout(() => {
        setReferralSource(otherSpecification);
      }, 600);
      return () => clearTimeout(debounceTimeout);
    }
  }, [otherSpecification, setReferralSource, referralSource]);

  const isMultiMemberPlan = membershipType && membershipType !== 'INDIVIDUAL';
  const memberLimit = membershipType ? MEMBER_LIMITS[membershipType] : 0;
  const canAddMoreMembers = members.length < memberLimit;

  const handleEdit = (step: number) => {
    // Save current state before editing
    saveOriginalState();
    // setStep(step);
    router.push(`/membership?step=${step}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span className='flex items-center gap-2'>
            <ClipboardList className='h-5 w-5 text-primary' />
            Membership Overview
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='w-full space-y-2'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <h3 className='text-sm font-medium'>Coverage Details</h3>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-muted-foreground hover:text-foreground'
              onClick={() => handleEdit(2)}
            >
              <Pencil className='mr-1 h-4 w-4' />
              <span className='hidden sm:inline'>Edit</span>
            </Button>
          </div>
          <CoverageDetails
            durationType={durationType}
            membershipType={membershipType}
            coverageType={coverageType}
            currency={currency}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className='space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <h3 className='text-sm font-medium'>Members</h3>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-muted-foreground hover:text-foreground'
              onClick={() => handleEdit(3)}
            >
              <Pencil className='mr-1 h-4 w-4' />
              <span className='hidden sm:inline'>Edit</span>
            </Button>
          </div>
          <Card className='divide-y'>
            {members.map((member, index) => (
              <MemberSummary
                key={member.id}
                member={member}
                isPrimary={index === 0}
                isComplete={medicalState.completedMembers[member.id] !== undefined}
              />
            ))}
          </Card>
          {isMultiMemberPlan && canAddMoreMembers && (
            <Button variant='outline' size='sm' className='mt-4 w-full' onClick={() => handleEdit(3)}>
              Add Another Member ({members.length}/{memberLimit})
            </Button>
          )}
        </div>

        <div className='border-t pt-4'>
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-sm font-medium'>
              <Ticket className='h-4 w-4 text-primary' />
              Referral Details
            </h3>
            <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
              <div className='relative w-full sm:max-w-xs'>
                <Input
                  placeholder='Enter referral code'
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className='pr-8'
                />
                {isValidatingCode && (
                  <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                    <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                  </div>
                )}
              </div>
              {validDiscount !== null && (
                <p className='flex items-center text-sm text-primary'>{validDiscount}% discount will be applied</p>
              )}
              {referralCode && validDiscount === null && !isValidatingCode && (
                <p className='flex items-center text-sm text-destructive'>Invalid referral code</p>
              )}
            </div>

            <div className='mt-4 space-y-2'>
              <div className='flex items-center gap-1'>
                <h3 className='text-sm font-medium'>How did you hear about us?</h3>
                <span className='text-sm text-destructive'>*</span>
              </div>
              <Select
                value={referralSource || ''}
                disabled={!!quote}
                onValueChange={(value) => {
                  setReferralSource(value);
                  if (value === 'Other (please specify)') {
                    setOtherSpecification('');
                  }
                }}
              >
                <SelectTrigger className='w-full sm:max-w-xs'>
                  <SelectValue placeholder='Please select' />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ...REFERRAL_SOURCES,
                    ...(referralSource && !REFERRAL_SOURCES.includes(referralSource as ReferralSource)
                      ? [referralSource]
                      : []),
                  ].map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(referralSource === 'Other (please specify)' ||
                (referralSource && !REFERRAL_SOURCES.includes(referralSource as ReferralSource))) && (
                <Input
                  placeholder='Please specify how you heard about us'
                  className='mt-2 w-full sm:max-w-xs'
                  value={otherSpecification}
                  onChange={(e) => setOtherSpecification(e.target.value)}
                  required
                  disabled={!!quote}
                />
              )}
              <p className='text-sm text-muted-foreground'>This information helps us improve our services</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
