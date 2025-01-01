import * as React from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface MonthPickerProps {
  onMonthSelect: (month: number) => void;
  selectedMonth?: number;
  year: number;
}

export function MonthPicker({ onMonthSelect, selectedMonth, year }: MonthPickerProps) {
  console.log('🚀 ~ MonthPicker ~ year:', year);
  const currentMonth = new Date().getMonth();
  const months = Array.from({ length: currentMonth + 1 }, (_, i) => format(new Date(year, i), 'MMMM'));

  return (
    <div className='p-3 text-white'>
      <div className='mb-2 text-center'>
        <span className='text-lg font-semibold'>{year}</span>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {months.map((month, index) => (
          <Button
            key={month}
            onClick={() => onMonthSelect(index)}
            variant='outline'
            className={cn(
              'text-white hover:bg-gray-700',
              index === selectedMonth && 'bg-white text-black hover:bg-gray-200 hover:text-black',
            )}
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );
}
