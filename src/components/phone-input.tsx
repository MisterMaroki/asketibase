import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COUNTRY_CODES } from '@/constants';
import { cn } from '@/utils/cn';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  error?: boolean;
}

export function PhoneInput({ className, countryCode, onCountryCodeChange, error, ...props }: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
  const formattedCountryCode = `(${countryCode}) `;

  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role='combobox'
            aria-expanded={open}
            className={cn(
              'flex h-10 w-[72px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive',
            )}
          >
            <div className='flex items-center gap-2'>
              {selectedCountry ? (
                <img
                  src={`https://flagcdn.com/${selectedCountry.name}.svg`}
                  alt={`${selectedCountry.label} flag`}
                  className='h-4 w-6 rounded object-cover'
                />
              ) : (
                <div className='h-4 w-6 rounded bg-muted' />
              )}
            </div>
            <ChevronDown className='h-4 w-4 shrink-0 opacity-50' />
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-[280px] p-0'>
          <Command>
            <CommandInput placeholder='Search country...' />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className='max-h-[300px] overflow-auto'>
              {COUNTRY_CODES.map((code) => (
                <CommandItem
                  key={`${code.name}-${code.code}`}
                  value={`${code.label} ${code.code}`}
                  onSelect={() => {
                    onCountryCodeChange(code.code);
                    setOpen(false);
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      src={`https://flagcdn.com/${code.name}.svg`}
                      alt={`${code.label} flag`}
                      className='h-4 w-6 rounded object-cover'
                    />
                    <span className='flex-1'>{code.label}</span>
                    <span className='text-muted-foreground'>{code.code}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className='relative flex-1'>
        <div className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground'>
          {formattedCountryCode}
        </div>
        <Input
          type='tel'
          className={cn('flex-1 pl-[calc(theme(spacing.2)+var(--country-code-width))]', error && 'border-destructive')}
          style={{ '--country-code-width': `${formattedCountryCode.length}ch` } as React.CSSProperties}
          {...props}
        />
      </div>
    </div>
  );
}
