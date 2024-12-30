import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface MonthPickerProps {
  onMonthSelect: (month: number) => void;
  selectedMonth?: number;
  year: number;
}

export function MonthPicker({ onMonthSelect, selectedMonth, year }: MonthPickerProps) {
  console.log('🚀 ~ MonthPicker ~ year:', year);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className='bg-black p-3 text-white'>
      <div className='mb-2 text-center'>
        <span className='text-lg font-semibold'>{year}</span>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {months.map((month, index) => (
          <Button
            key={month}
            onClick={() => onMonthSelect(index)}
            variant='ghost'
            className={cn(
              'text-white hover:bg-gray-700',
              index === selectedMonth && 'bg-white text-black hover:bg-gray-200 hover:text-black'
            )}
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
}
