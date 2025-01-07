import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface YearPickerProps {
  onYearSelect: (year: number) => void;
  selectedYear?: number;
  decade: number;
}

export function YearPicker({ onYearSelect, selectedYear, decade }: YearPickerProps) {
  const years = Array.from({ length: 10 }, (_, i) => decade + i);
  const currentYear = new Date().getFullYear();

  const filteredYears = years.filter((year) => year <= currentYear);

  return (
    <div className='bg-background p-3'>
      <div className='mb-2 flex items-center justify-center'>
        <span className='text-card-foreground'>{decade}s</span>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {filteredYears.map((year) => (
          <Button
            key={year}
            onClick={() => onYearSelect(year)}
            variant='outline'
            className={cn(
              'border-border bg-card text-card-foreground hover:bg-secondary hover:text-secondary-foreground',
              year === selectedYear && 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );
}
