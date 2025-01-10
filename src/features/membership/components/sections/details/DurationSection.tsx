'use client';

import { Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMembershipStore } from '@/store/membership-store';

import { DateSelector } from './duration/DateSelector';
import { DurationOptions } from './duration/DurationOptions';

export function DurationSection() {
  const { startDate, endDate, setStartDate, setEndDate, durationType } = useMembershipStore();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <Card className='animate-slide-down'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5 text-primary' />
          Coverage Duration
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <DurationOptions />
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          maxDate={maxDate}
          durationType={durationType}
        />
      </CardContent>
    </Card>
  );
}
