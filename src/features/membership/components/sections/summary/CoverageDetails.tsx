'use client';

import { differenceInDays, format } from 'date-fns';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { COVERAGE_TYPES, DURATION_DETAILS, DURATION_TYPES, MEMBERSHIP_TYPES } from '@/constants';

interface CoverageDetailsProps {
  durationType: string | null;
  membershipType: string | null;
  coverageType: string | null;
  currency: string | null;
  startDate: string | null;
  endDate: string | null;
}

export function CoverageDetails({
  durationType,
  membershipType,
  coverageType,
  currency,
  startDate,
  endDate,
}: CoverageDetailsProps) {
  const getDurationInfo = () => {
    if (!durationType) return null;
    const type = durationType as keyof typeof DURATION_TYPES;
    return DURATION_DETAILS[type];
  };

  const durationInfo = getDurationInfo();
  const totalDays = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) : null;

  return (
    <dl className='grid gap-6'>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-1 text-sm'>
          <dt className='text-muted-foreground'>Currency:</dt>
          <dd className='font-medium'>{currency}</dd>
        </div>
        <div className='space-y-1 text-sm'>
          <dt className='text-muted-foreground'>Type:</dt>
          <dd className='font-medium'>
            {membershipType && MEMBERSHIP_TYPES[membershipType as keyof typeof MEMBERSHIP_TYPES]}
          </dd>
        </div>
        <div className='space-y-1 text-sm'>
          <dt className='text-muted-foreground'>Coverage:</dt>
          <dd className='font-medium'>{coverageType && COVERAGE_TYPES[coverageType as keyof typeof COVERAGE_TYPES]}</dd>
        </div>
        <div className='space-y-1 text-sm'>
          <dt className='text-muted-foreground'>Duration Type:</dt>
          <dd className='font-medium'>
            {durationInfo?.title}
            {totalDays && ` (${totalDays} days)`}
          </dd>
        </div>
      </div>

      {durationInfo && (
        <div className='space-y-2 rounded-lg bg-muted/50 p-4'>
          <div className='flex items-center gap-2 text-sm font-medium'>
            <Clock className='h-4 w-4 text-primary' />
            Duration Details
          </div>
          <p className='text-sm text-muted-foreground'>{durationInfo.description}</p>
          <div className='flex gap-2 pt-2'>
            {startDate && (
              <Badge variant='outline' className='font-normal'>
                Start: {format(new Date(startDate), 'PPP')}
              </Badge>
            )}
            {endDate && (
              <Badge variant='outline' className='font-normal'>
                End: {format(new Date(endDate), 'PPP')}
              </Badge>
            )}
          </div>
        </div>
      )}
    </dl>
  );
}
