import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface YearPickerProps {
  onYearSelect: (year: number) => void;
  selectedYear?: number;
  decade: number;
}

export function YearPicker({ onYearSelect, selectedYear, decade }: YearPickerProps) {
  const years = Array.from({ length: 10 }, (_, i) => decade + i);

  return (
    <div className='bg-black p-3 text-white'>
      <div className='mb-2 flex items-center justify-center'>
        <span>{decade}s</span>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {years.map((year) => (
          <Button
            key={year}
            onClick={() => onYearSelect(year)}
            variant='ghost'
            className={`text-white hover:bg-gray-700 ${
              year === selectedYear ? 'bg-white text-black hover:bg-gray-200 hover:text-black' : ''
            }`}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
