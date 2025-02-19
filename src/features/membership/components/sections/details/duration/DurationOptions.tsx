'use client';

import { addMonths, addYears, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { Calendar, CalendarClock, Plane } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DURATION_DETAILS, DURATION_TYPES } from '@/constants';
import { useMembershipStore } from '@/store/membership-store';

const durationIcons = {
  [DURATION_TYPES.expat_year]: Plane,
  [DURATION_TYPES.multi_trip]: CalendarClock,
  [DURATION_TYPES.single_trip]: Calendar,
} as const;

export function DurationOptions() {
  const { durationType, startDate, endDate, setDurationType } = useMembershipStore();

  const getDurationText = () => {
    if (!startDate || !endDate) return null;

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const years = differenceInYears(endDateTime, startDateTime);
    let remainingDate = startDateTime;

    if (years > 0) {
      remainingDate = addYears(remainingDate, years);
    }

    const months = differenceInMonths(endDateTime, remainingDate);
    if (months > 0) {
      remainingDate = addMonths(remainingDate, months);
    }

    const days = differenceInDays(endDateTime, remainingDate);

    const parts = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);

    return parts.join(', ');
  };

  const durationText = getDurationText();

  return (
    <div className='space-y-4 px-1 sm:px-0'>
      <RadioGroup
        value={durationType || ''}
        onValueChange={(value) => setDurationType(value as keyof typeof DURATION_TYPES)}
        className='grid gap-3 sm:gap-4'
      >
        {Object.entries({
          // [DURATION_TYPES.expat_year]: DURATION_DETAILS.expat_year,
          [DURATION_TYPES.multi_trip]: DURATION_DETAILS.multi_trip,
          [DURATION_TYPES.single_trip]: DURATION_DETAILS.single_trip,
        }).map(([key, { title, description }]) => {
          const Icon = durationIcons[key as keyof typeof DURATION_TYPES];
          return (
            <Label
              key={key}
              className='group relative flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-accent/5 hover:text-accent-foreground active:bg-accent/10 sm:space-x-4 sm:p-4 [&:has([data-state=checked])]:border-primary'
            >
              {key === DURATION_TYPES.multi_trip && (
                <span className='absolute -top-2 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground'>
                  RECOMMENDED
                </span>
              )}
              <RadioGroupItem value={key} id={key} className='sr-only mt-1' />
              {Icon && (
                <Icon className='mt-0.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary group-[&:has([data-state=checked])]:text-primary' />
              )}
              <div className='min-w-0 flex-1 space-y-1.5'>
                <p className='font-medium leading-tight'>{title}</p>
                <p className='break-words text-sm text-muted-foreground'>{description}</p>
              </div>
            </Label>
          );
        })}
      </RadioGroup>
      {durationText && (
        <div className='rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary'>
          Total duration: {durationText}
        </div>
      )}
    </div>
  );
}
