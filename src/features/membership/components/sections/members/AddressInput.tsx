'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

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

export function AddressInput({ value, onChange, disabled, className }: AddressInputProps) {
  const [isManual, setIsManual] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [manualAddress, setManualAddress] = useState<ManualAddress>({
    line1: '',
    line2: '',
    city: '',
    region: '',
    postcode: '',
  });
  const error = getAddressError(value);

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

  useEffect(() => {
    if (isManual && value) {
      const parts = value.split(',').map((part) => part.trim());
      setManualAddress({
        line1: parts[0] || '',
        line2: parts[1] || '',
        city: parts[2] || '',
        region: parts[3] || '',
        postcode: parts[4] || '',
      });
    }
  }, [isManual, value]);

  const handleManualChange = (field: keyof ManualAddress, fieldValue: string) => {
    const newAddress = { ...manualAddress, [field]: fieldValue };
    setManualAddress(newAddress);

    const combinedAddress = [
      newAddress.line1,
      newAddress.line2,
      newAddress.city,
      newAddress.region,
      newAddress.postcode,
    ]
      .filter(Boolean)
      .join(', ');

    onChange(combinedAddress);
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor='address'>Home Address</Label>
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
              value={manualAddress.line1}
              onChange={(e) => handleManualChange('line1', e.target.value)}
              disabled={disabled}
              className={cn(error ? 'border-destructive' : '', className)}
            />
          </div>
          <div className='space-y-2'>
            <Input
              placeholder='Address Line 2 (Optional)'
              value={manualAddress.line2}
              onChange={(e) => handleManualChange('line2', e.target.value)}
              disabled={disabled}
              className={cn(error ? 'border-destructive' : '', className)}
            />
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Input
                placeholder='City'
                value={manualAddress.city}
                onChange={(e) => handleManualChange('city', e.target.value)}
                disabled={disabled}
                className={cn(error ? 'border-destructive' : '', className)}
              />
            </div>
            <div className='space-y-2'>
              <Input
                placeholder='State/Region'
                value={manualAddress.region}
                onChange={(e) => handleManualChange('region', e.target.value)}
                disabled={disabled}
                className={cn(error ? 'border-destructive' : '', className)}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Input
              placeholder='Postcode'
              value={manualAddress.postcode}
              onChange={(e) => handleManualChange('postcode', e.target.value)}
              disabled={disabled}
              className={cn(error ? 'border-destructive' : '', className)}
            />
          </div>
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
            }}
            disabled={disabled}
          >
            Use address search
          </Button>
          {error && <p className='text-xs text-destructive'>{error}</p>}
        </div>
      )}
    </div>
  );
}
