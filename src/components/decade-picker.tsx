import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface DecadePickerProps {
  onDecadeSelect: (startYear: number) => void;
  selectedDecade?: number;
}

export function DecadePicker({ onDecadeSelect, selectedDecade }: DecadePickerProps) {
  const currentYear = new Date().getFullYear();
  const startDecade = Math.floor((currentYear - 80) / 10) * 10;

  const decades = Array.from({ length: 9 }, (_, i) => startDecade + i * 10);

  return (
    <div className='p-3 text-white'>
      <div className='mb-2 flex items-center justify-center'>
        <span>
          {startDecade} - {startDecade + 79}
        </span>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {decades.map((decade) => (
          <Button
            key={decade}
            onClick={() => onDecadeSelect(decade)}
            variant='outline'
            className={cn(
              'text-white hover:bg-gray-700',
              decade === selectedDecade && 'bg-white text-black hover:bg-gray-200 hover:text-black',
            )}
          >
            {decade}s
          </Button>
        ))}
      </div>
    </div>
  );
}
