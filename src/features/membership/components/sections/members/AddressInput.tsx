'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAddressError } from '@/features/membership/validations/address';
interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AddressInput({ value, onChange, disabled }: AddressInputProps) {
  const [isManual, setIsManual] = useState(false);
  const error = getAddressError(value);

  // TODO: Implement Google Places Autocomplete when API key is available
  const handleAutocomplete = () => {
    setIsManual(true);
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor='address'>Home Address</Label>
      {!isManual ? (
        <div className='space-y-2'>
          <Button
            type='button'
            variant='outline'
            className='w-full justify-start'
            onClick={handleAutocomplete}
            disabled={disabled}
          >
            <MapPin className='mr-2 h-4 w-4' />
            Search for address
          </Button>
          <Button
            type='button'
            variant='link'
            className='text-xs'
            onClick={() => setIsManual(true)}
            disabled={disabled}
          >
            Enter address manually
          </Button>
        </div>
      ) : (
        <div className='space-y-1'>
          <Input
            id='address'
            name='address'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder='Enter your full address'
            autoComplete='street-address'
            required
            disabled={disabled}
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className='text-xs text-destructive'>{error}</p>}
        </div>
      )}
    </div>
  );
}
