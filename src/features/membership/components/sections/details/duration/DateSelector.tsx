'use client';

import { useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DURATION_DETAILS, DURATION_TYPES } from '@/constants';

interface DateSelectorProps {
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  maxDate: Date;
  durationType: keyof typeof DURATION_TYPES | null;
}

export function DateSelector({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  maxDate,
  durationType,
}: DateSelectorProps) {
  // Clear end date when duration type changes
  useEffect(() => {
    if (durationType !== 'single_trip') {
      setEndDate(null);
    }
  }, [durationType, setEndDate, startDate]);

  // Calculate date constraints
  const dateConstraints = useMemo(() => {
    if (!startDate || durationType !== 'single_trip') return null;
    const minDate = new Date(startDate);
    minDate.setDate(minDate.getDate() + 2); // Minimum 2 days

    const maxDate = new Date(startDate);
    maxDate.setDate(maxDate.getDate() + 365); // Maximum 365 days

    return {
      min: minDate,
      max: maxDate,
    };
  }, [startDate, durationType]);

  const description = durationType ? DURATION_DETAILS[durationType]?.description : '';
  const isSingleTrip = durationType === DURATION_TYPES.single_trip;

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Cover Start Date</label>
        <div className='relative'>
          <div className='flex gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-full justify-start text-left font-normal'>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {startDate ? format(parseISO(startDate), 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={startDate ? parseISO(startDate) : undefined}
                  onSelect={(date) => setStartDate(date?.toISOString() || null)}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const dateToCheck = new Date(date);
                    dateToCheck.setHours(0, 0, 0, 0);
                    return dateToCheck < today || date > maxDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {durationType && !isSingleTrip && startDate && <p className='text-sm text-muted-foreground'>{description}</p>}
      </div>

      {isSingleTrip && startDate && (
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Cover End Date</label>
          <div className='relative'>
            <div className='flex gap-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-start text-left font-normal'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {endDate ? format(parseISO(endDate), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={endDate ? parseISO(endDate) : undefined}
                    onSelect={(date) => setEndDate(date?.toISOString() || null)}
                    disabled={(date) => !dateConstraints || date < dateConstraints.min || date > dateConstraints.max}
                    defaultMonth={startDate ? parseISO(startDate) : undefined}
                    fromDate={dateConstraints?.min}
                    toDate={dateConstraints?.max}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {dateConstraints && (
              <p className='mt-1 text-xs text-muted-foreground'>
                Select a date between {format(dateConstraints.min, 'PP')} and {format(dateConstraints.max, 'PP')}
              </p>
            )}
          </div>
          {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        </div>
      )}
    </div>
  );
}
