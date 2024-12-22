'use client';

import { format } from 'date-fns';
import { Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { COVERAGE_TYPES, DURATION_DETAILS, DURATION_TYPES, MEMBERSHIP_TYPES } from '@/constants/membership';

interface CoverageDetailsProps {
  membershipType: string | null;
  coverageType: string | null;
  durationType: string | null;
  currency: string | null;
  startDate: string | null;
  endDate: string | null;
}

export function CoverageDetails({
  membershipType,
  coverageType,
  durationType,
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
          <dd className='font-medium'>{durationInfo?.title}</dd>
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
                Start: {format(startDate, 'PPP')}
              </Badge>
            )}
            {endDate && (
              <Badge variant='outline' className='font-normal'>
                End: {format(endDate, 'PPP')}
              </Badge>
            )}
          </div>
        </div>
      )}
    </dl>
  );
}
