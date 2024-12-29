'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DURATION_DETAILS, DURATION_TYPES } from '@/constants/membership';
import { parseNaturalDate } from '@/utils/date-parser';

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
  const [naturalDateInput, setNaturalDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<NodeJS.Timeout>();

  // Clear end date when duration type changes
  useEffect(() => {
    if (durationType !== 'single_trip') {
      setEndDate(null);
      setEndDateInput('');
    }
  }, [durationType, setEndDate]);

  // Set end date for expat duration type
  useEffect(() => {
    if (durationType === DURATION_TYPES.expat_year && startDate) {
      const expatEndDate = new Date(startDate);
      expatEndDate.setFullYear(expatEndDate.getFullYear() + 1);
      setEndDate(expatEndDate.toISOString());
    }
  }, [durationType, startDate, setEndDate]);

  // Calculate date constraints
  const dateConstraints = useMemo(() => {
    if (!startDate || durationType !== 'single_trip') return null;
    const minDate = new Date(startDate);
    minDate.setDate(minDate.getDate() + 7); // Minimum 7 days

    const maxDate = new Date(startDate);
    maxDate.setDate(maxDate.getDate() + 180); // Maximum 180 days

    return {
      min: minDate,
      max: maxDate,
    };
  }, [startDate, durationType]);

  // Reset end date if duration type changes from single trip
  useEffect(() => {
    if (durationType !== DURATION_TYPES.single_trip) {
      setEndDate(null);
      setEndDateInput('');
    }
  }, [durationType, setEndDate]);

  useEffect(() => {
    return () => {
      if (hintTimer.current) {
        clearTimeout(hintTimer.current);
      }
    };
  }, []);

  const handleFocus = () => {
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
    }
    hintTimer.current = setTimeout(() => {
      setShowHint(true);
    }, 6000);
  };

  const handleBlur = () => {
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
    }
    setShowHint(false);
  };

  const handleNaturalDateInput = (input: string) => {
    setNaturalDateInput(input);
    const parsedDate = parseNaturalDate(input);
    if (parsedDate && parsedDate >= new Date() && parsedDate <= maxDate) {
      setStartDate(parsedDate.toISOString());

      // Auto-set end date for expat duration
      if (durationType === DURATION_TYPES.expat_year) {
        const expatEndDate = new Date(parsedDate);
        expatEndDate.setFullYear(expatEndDate.getFullYear() + 1);
        setEndDate(expatEndDate.toISOString());
      }
    }
  };

  const handleEndDateInput = (input: string) => {
    setEndDateInput(input);
    const parsedDate = parseNaturalDate(input);

    if (parsedDate && dateConstraints) {
      if (parsedDate >= dateConstraints.min && parsedDate <= dateConstraints.max) {
        setEndDate(parsedDate.toISOString());
      } else {
        // Invalid date, clear end date
        setEndDate(null);
      }
    }
  };

  const description = durationType ? DURATION_DETAILS[durationType]?.description : '';
  const isSingleTrip = durationType === DURATION_TYPES.single_trip;

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium'>Start Date</label>
        <div className='relative'>
          <div className='flex gap-2'>
            <Input
              placeholder='e.g. in 3 weeks'
              value={naturalDateInput}
              onChange={(e) => handleNaturalDateInput(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className='flex-1'
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' size='icon'>
                  <CalendarIcon className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  mode='single'
                  selected={startDate ? parseISO(startDate) : undefined}
                  onSelect={(date) => {
                    setStartDate(date?.toISOString() || null);
                    if (date) {
                      setNaturalDateInput(format(date, 'PPP'));
                      setShowHint(false);
                    }
                  }}
                  disabled={(date) => date < new Date() || date > maxDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {showHint && (
            <div
              className='animate-fade-in absolute right-14 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
              style={{ animation: 'fadeIn 0.3s ease-out' }}
            >
              Try using the calendar →
            </div>
          )}
        </div>
        {startDate && <div className='text-sm text-primary'>Start Date: {format(startDate, 'PPP')}</div>}
        {durationType && !isSingleTrip && startDate && <p className='text-sm text-muted-foreground'>{description}</p>}
      </div>

      {isSingleTrip && startDate && (
        <div className='space-y-2'>
          <label className='text-sm font-medium'>End Date</label>
          <div className='relative'>
            <div className='flex gap-2'>
              <Input
                placeholder='e.g. in 3 weeks'
                value={endDateInput}
                onChange={(e) => handleEndDateInput(e.target.value)}
                className='flex-1'
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <CalendarIcon className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='end'>
                  <Calendar
                    mode='single'
                    selected={endDate ? parseISO(endDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date.toISOString());
                        setEndDateInput(format(date, 'PPP'));
                      }
                    }}
                    disabled={(date) => !dateConstraints || date < dateConstraints.min || date > dateConstraints.max}
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
          {endDate && <div className='text-sm text-primary'>End Date: {format(endDate, 'PPP')}</div>}
          {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        </div>
      )}
    </div>
  );
}
