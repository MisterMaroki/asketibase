'use client';

import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { Calendar, CalendarClock, Plane } from 'lucide-react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DURATION_DETAILS, DURATION_TYPES } from '@/constants/membership';
import { useMembershipStore } from '@/store/membership-store';

const durationIcons = {
  [DURATION_TYPES.expat_year]: Plane,
  [DURATION_TYPES.multi_trip]: CalendarClock,
  [DURATION_TYPES.single_trip]: Calendar,
} as const;

export function DurationOptions() {
  const { durationType, startDate, endDate, setDurationType } = useMembershipStore();
  const defaultDurationType = DURATION_TYPES.expat_year;

  const getDurationText = () => {
    if (!startDate || !endDate) return null;

    const years = differenceInYears(endDate, startDate);
    const months = differenceInMonths(endDate, startDate) % 12;
    const days = differenceInDays(endDate, startDate) % 30;

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
        value={durationType || defaultDurationType}
        onValueChange={(value) => setDurationType(value as keyof typeof DURATION_TYPES)}
        className='grid gap-3 sm:gap-4'
      >
        {Object.entries(DURATION_DETAILS).map(([key, { title, description }]) => {
          const Icon = durationIcons[key as keyof typeof DURATION_TYPES];
          return (
            <label
              key={key}
              className='group flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-accent/5 active:bg-accent/10 sm:space-x-4 sm:p-4'
            >
              <RadioGroupItem value={key} id={key} className='mt-1' />
              {Icon && (
                <Icon className='mt-0.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary' />
              )}
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='font-medium leading-tight'>{title}</p>
                <p className='break-words text-sm text-muted-foreground'>{description}</p>
              </div>
            </label>
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
