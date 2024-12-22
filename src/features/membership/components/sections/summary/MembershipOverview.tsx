'use client';

import { useRouter } from 'next/navigation';
import { ClipboardList, Pencil, Ticket } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEMBER_LIMITS } from '@/constants/membership';
import { REFERRAL_SOURCES } from '@/constants/options';
import { useCountries } from '@/hooks/use-countries';
import { useMembershipStore } from '@/store/membership-store';

import { CoverageDetails } from './CoverageDetails';
import { MemberSummary } from './MemberSummary';

export function MembershipOverview() {
  const router = useRouter();
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
      <CardContent className='grid gap-4 sm:grid-cols-2'>
        <div className='col-span-2 w-full space-y-2 '>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Coverage Details</h3>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-muted-foreground hover:text-foreground'
              onClick={() => handleEdit(2)}
            >
              <Pencil className='mr-1 h-4 w-4' />
              Edit
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

        <div className='pt-4 sm:col-span-2'>
          <div className='mb-2 flex items-center justify-between'>
            <h3 className='text-sm font-medium'>Members</h3>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-muted-foreground hover:text-foreground'
              onClick={() => handleEdit(3)}
            >
              <Pencil className='mr-1 h-4 w-4' />
              Edit
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

        <div className='border-t pt-4 sm:col-span-2'>
          <div className='space-y-4'>
            <h3 className='flex items-center gap-2 text-sm font-medium'>
              <Ticket className='h-4 w-4 text-primary' />
              Referral Details
            </h3>
            <div className='flex gap-4'>
              <Input
                placeholder='Enter referral code (optional)'
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className='max-w-xs'
              />
              {referralCode && <p className='flex items-center text-sm text-primary'>10% discount applied</p>}
            </div>

            <div className='mt-4 space-y-2'>
              <div className='flex items-center gap-1'>
                <h3 className='text-sm font-medium'>How did you hear about us?</h3>
                <span className='text-sm text-destructive'>*</span>
              </div>
              <Select value={referralSource || ''} onValueChange={setReferralSource}>
                <SelectTrigger className='max-w-xs'>
                  <SelectValue placeholder='Please select' />
                </SelectTrigger>
                <SelectContent>
                  {REFERRAL_SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {referralSource === 'Other (please specify)' && (
                <Input
                  placeholder='Please specify how you heard about us'
                  className='mt-2 max-w-xs'
                  value={referralSource === 'Other (please specify)' ? '' : undefined}
                  onChange={(e) => setReferralSource(e.target.value)}
                  required
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
