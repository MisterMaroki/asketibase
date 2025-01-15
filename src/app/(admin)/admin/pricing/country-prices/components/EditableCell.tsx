'use client';

import { useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/libs/supabase/types';

import { updateCountryBasePrice } from '../../actions';

interface EditableCellProps {
  id: string;
  value: string | number;
  field: keyof Tables<'country_base_prices'>;
  type?: 'text' | 'number';
}

export function EditableCell({ id, value: initialValue, field, type = 'text' }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<typeof initialValue>(initialValue);
  const toast = useToast();
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await updateCountryBasePrice(id, { [field]: value });

      if (!response?.success) {
        throw new Error(response?.error || `Failed to update ${field}`);
      }

      toast.toast({
        title: `${field} updated successfully`,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.toast({
        title: `Failed to update ${field}`,
        variant: 'destructive',
      });
      setValue(initialValue);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className='flex items-center gap-2'>
        <Input
          type={type}
          value={value}
          onChange={(e) => setValue(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          className='h-8'
        />
        <Button size='sm' variant='ghost' onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Check className='h-4 w-4 shrink-0' />}
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => {
            setValue(initialValue);
            setIsEditing(false);
          }}
          disabled={isLoading}
        >
          <X className='h-4 w-4 shrink-0' />
        </Button>
      </div>
    );
  }

  return (
    <div className='cursor-pointer hover:underline' onClick={() => setIsEditing(true)}>
      {type === 'number' ? (value as number).toLocaleString() : value}
    </div>
  );
}
