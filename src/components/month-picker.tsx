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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: format(new Date(year, i), 'MMMM'),
    days: new Date(year, i + 1, 0).getDate(),
  }))
    .filter((month, index) => {
      if (year < currentYear) return true;
      if (year === currentYear) {
        if (index < currentMonth) return true;
        if (index === currentMonth) return currentDay > 1;
      }
      return false;
    })
    .map((month) => month.name);

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
