'use client';

import { useEffect, useState } from 'react';
import { Copy, Loader2, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getPlaceDetails, getPlacesPredictions } from '@/features/membership/actions/get-places-predictions';
import { getAddressError } from '@/features/membership/validations/address';
import { useMembershipStore } from '@/store/membership-store';
import { cn } from '@/utils/cn';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  showCopyFromPrimary?: boolean;
}

interface Prediction {
  description: string;
  placeId: string;
}

interface ManualAddress {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postcode: string;
}

interface ManualAddressErrors {
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postcode?: string;
}

export function AddressInput({ value, onChange, disabled, className, showCopyFromPrimary }: AddressInputProps) {
  const [isManual, setIsManual] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [errors, setErrors] = useState<ManualAddressErrors>({});
  const [manualAddress, setManualAddress] = useState<ManualAddress>(() => {
    if (value) {
      const parts = value.split(',').map((part) => part.trim());
      return {
        line1: parts[0] || '',
        line2: parts[1] || '',
        city: parts[2] || '',
        region: parts[3] || '',
        postcode: parts[4] || '',
      };
    }
    return {
      line1: '',
      line2: '',
      city: '',
      region: '',
      postcode: '',
    };
  });
  const error = getAddressError(value);
  const { members } = useMembershipStore();

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (!search) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await getPlacesPredictions(search);
        setPredictions(results);
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(debounceTimeout);
  }, [search]);

  const handleSelect = async (placeId: string) => {
    try {
      setLoading(true);
      const address = await getPlaceDetails(placeId);
      if (address) {
        onChange(address);
      }
    } catch (error) {
      console.error('Failed to fetch place details:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const validateAddress = (address: ManualAddress): ManualAddressErrors => {
    const errors: ManualAddressErrors = {};

    if (!address.line1.trim()) {
      errors.line1 = 'Address line 1 is required';
    }

    if (!address.city.trim()) {
      errors.city = 'City is required';
    }

    if (!address.region.trim()) {
      errors.region = 'State/Region is required';
    }

    if (!address.postcode.trim()) {
      errors.postcode = 'Postal/ZIP code is required';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(address.postcode.trim())) {
      errors.postcode = 'Invalid postal/ZIP code format';
    }

    return errors;
  };

  const handleManualChange = (field: keyof ManualAddress, fieldValue: string) => {
    const newAddress = { ...manualAddress, [field]: fieldValue };
    setManualAddress(newAddress);

    // Clear the error for this field as user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    const parts = Object.values(newAddress);
    const nonEmptyParts = parts.filter((part) => part !== '');
    onChange(nonEmptyParts.join(', '));

    // Validate after a short delay to avoid interrupting typing
    const timeoutId = setTimeout(() => {
      const newErrors = validateAddress(newAddress);
      setErrors(newErrors);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label htmlFor='address'>Home Address *</Label>
        {showCopyFromPrimary && members.length > 0 && (
          <Button
            type='button'
            variant='link'
            className='text-xs text-muted-foreground hover:text-foreground'
            onClick={() => {
              const primaryMember = members[0];
              onChange(primaryMember.address);
            }}
            disabled={disabled}
          >
            <Copy className='mr-2 h-3 w-3' />
            Copy from Primary Member
          </Button>
        )}
      </div>
      {!isManual ? (
        <div className='space-y-2 overflow-hidden'>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className={cn('w-full justify-between', className)}
                disabled={disabled}
              >
                {value ? (
                  value
                ) : (
                  <>
                    <MapPin className='mr-2 h-4 w-4' />
                    Search for address
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[400px] p-0'>
              <Command>
                <CommandInput placeholder='Search address...' value={search} onValueChange={setSearch} />
                <CommandEmpty>
                  {loading ? (
                    <div className='flex items-center justify-center py-6'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  ) : (
                    'No address found.'
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {predictions.map((prediction) => (
                    <CommandItem
                      key={prediction.placeId}
                      value={prediction.description}
                      onSelect={() => handleSelect(prediction.placeId)}
                    >
                      <MapPin className='mr-2 h-4 w-4' />
                      {prediction.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Input
              placeholder='Address Line 1'
              name='address-line1'
              autoComplete='address-line1'
              value={manualAddress.line1}
              onChange={(e) => handleManualChange('line1', e.target.value)}
              disabled={disabled}
              className={cn(errors.line1 ? 'border-destructive' : '', className)}
            />
            {errors.line1 && <p className='text-xs text-destructive'>{errors.line1}</p>}
          </div>
          <div className='space-y-2'>
            <Input
              placeholder='Address Line 2 (Optional)'
              name='address-line2'
              autoComplete='address-line2'
              value={manualAddress.line2}
              onChange={(e) => handleManualChange('line2', e.target.value)}
              disabled={disabled}
              className={className}
            />
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Input
                placeholder='City'
                name='address-level2'
                autoComplete='address-level2'
                value={manualAddress.city}
                onChange={(e) => handleManualChange('city', e.target.value)}
                disabled={disabled}
                className={cn(errors.city ? 'border-destructive' : '', className)}
              />
              {errors.city && <p className='text-xs text-destructive'>{errors.city}</p>}
            </div>
            <div className='space-y-2'>
              <Input
                placeholder='State/Region'
                name='address-level1'
                autoComplete='address-level1'
                value={manualAddress.region}
                onChange={(e) => handleManualChange('region', e.target.value)}
                disabled={disabled}
                className={cn(errors.region ? 'border-destructive' : '', className)}
              />
              {errors.region && <p className='text-xs text-destructive'>{errors.region}</p>}
            </div>
          </div>
          <div className='space-y-2'>
            <Input
              placeholder='Postal/ZIP Code'
              name='postal-code'
              autoComplete='postal-code'
              value={manualAddress.postcode}
              onChange={(e) => handleManualChange('postcode', e.target.value)}
              disabled={disabled}
              className={cn(errors.postcode ? 'border-destructive' : '', className)}
            />
            {errors.postcode && <p className='text-xs text-destructive'>{errors.postcode}</p>}
          </div>
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='link'
              className='text-xs'
              onClick={() => {
                setIsManual(false);
                setManualAddress({
                  line1: '',
                  line2: '',
                  city: '',
                  region: '',
                  postcode: '',
                });
                setErrors({});
              }}
              disabled={disabled}
            >
              Use address search
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
