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
    <div className='bg-background p-3'>
      <div className='mb-2 flex items-center justify-center'>
        <span className='text-card-foreground'>
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
              'border-border bg-card text-card-foreground hover:bg-secondary hover:text-secondary-foreground',
              decade === selectedDecade && 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {decade}s
          </Button>
        ))}
      </div>
    </div>
  );
}
