'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';

import { DecadePicker } from './decade-picker';
import { MonthPicker } from './month-picker';
import { YearPicker } from './year-picker';

export interface BlackDOBInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

export function BlackDOBInput({ value, onChange, className }: BlackDOBInputProps) {
  const date = value ? new Date(value) : undefined;
  const [decade, setDecade] = React.useState<number>();
  const [year, setYear] = React.useState<number>();
  const [month, setMonth] = React.useState<number>();
  const [step, setStep] = React.useState<'decade' | 'year' | 'month' | 'date'>('decade');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDecadeSelect = (selectedDecade: number) => {
    setDecade(selectedDecade);
    setStep('year');
  };

  const handleYearSelect = (selectedYear: number) => {
    setYear(selectedYear);
    setStep('month');
  };

  const handleMonthSelect = (selectedMonth: number) => {
    setMonth(selectedMonth);
    setStep('date');
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate);
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth());
      setDecade(Math.floor(selectedDate.getFullYear() / 10) * 10);
    } else {
      setYear(undefined);
      setMonth(undefined);
      setDecade(undefined);
    }
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (!date) {
        const currentYear = new Date().getFullYear();
        const startDecade = Math.floor((currentYear - 100) / 10) * 10;
        setDecade(startDecade);
        setYear(startDecade);
        setMonth(0);
      } else {
        setDecade(Math.floor(date.getFullYear() / 10) * 10);
        setYear(date.getFullYear());
        setMonth(date.getMonth());
      }
      setStep('decade');
    }
    setIsOpen(open);
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              'transition-all duration-300 ease-in-out',
              !date && 'text-gray-400',
              className,
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : <span>Date of Birth</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='h-96 scale-95 border-gray-700 bg-black/80 p-0 backdrop-blur-xl sm:scale-100'>
          {step === 'decade' && <DecadePicker onDecadeSelect={handleDecadeSelect} />}
          {step === 'year' && decade && <YearPicker onYearSelect={handleYearSelect} decade={decade} />}
          {step === 'month' && year ? <MonthPicker onMonthSelect={handleMonthSelect} year={year} /> : null}
          {step === 'date' && year !== undefined && month !== undefined && (
            <Calendar
              mode='single'
              selected={date}
              onSelect={handleDateSelect}
              defaultMonth={new Date(year, month)}
              initialFocus
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
