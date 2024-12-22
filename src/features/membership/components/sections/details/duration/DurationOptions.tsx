'use client';

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
  const { durationType, setDurationType } = useMembershipStore();
  const defaultDurationType = DURATION_TYPES.expat_year;

  return (
    <div className='space-y-4'>
      <RadioGroup
        value={durationType || defaultDurationType}
        onValueChange={(value) => setDurationType(value as keyof typeof DURATION_TYPES)}
        className='grid gap-4'
      >
        {Object.entries(DURATION_DETAILS).map(([key, { title, description }]) => {
          const Icon = durationIcons[key as keyof typeof DURATION_TYPES];
          return (
            <label
              key={key}
              className='flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-accent/5'
            >
              <RadioGroupItem value={key} id={key} />
              {Icon && <Icon className='h-5 w-5 text-muted-foreground' />}
              <div className='space-y-1'>
                <p className='font-medium'>{title}</p>
                <p className='text-sm text-muted-foreground'>{description}</p>
              </div>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
