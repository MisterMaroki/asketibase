/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCIES } from '@/constants/options';
import { ColumnDef } from '@tanstack/react-table';

interface CountryBasePrice {
  id: string;
  country: string;
  country_code: string;
  base_price: number;
}

export const columns: ColumnDef<CountryBasePrice>[] = [
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [value, setValue] = useState<string>(row.getValue('country'));
      const onSave = (table?.options.meta as any)?.onSave;

      if (isEditing) {
        return (
          <div className='flex items-center gap-2'>
            <Input value={value as unknown as string} onChange={(e) => setValue(e.target.value)} className='h-8' />
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                onSave?.(row.original.id, { country: value });
                setIsEditing(false);
              }}
            >
              <Check className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                setValue(row.getValue('country'));
                setIsEditing(false);
              }}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        );
      }

      return (
        <div className='cursor-pointer hover:underline' onClick={() => setIsEditing(true)}>
          {row.getValue('country')}
        </div>
      );
    },
  },
  {
    accessorKey: 'country_code',
    header: 'Country Code',
    cell: ({ row }) => {
      return <div>{row.getValue('country_code')}</div>;
    },
  },
  {
    accessorKey: 'base_price',
    header: 'Base Price',
    cell: ({ row, table }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [value, setValue] = useState<number>(row.getValue('base_price'));
      const onSave = (table?.options.meta as any)?.onSave;

      if (isEditing) {
        return (
          <div className='flex items-center gap-2'>
            <Input type='number' value={value} onChange={(e) => setValue(parseFloat(e.target.value))} className='h-8' />
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                onSave?.(row.original.id, { base_price: value });
                setIsEditing(false);
              }}
            >
              <Check className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                setValue(row.getValue('base_price'));
                setIsEditing(false);
              }}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        );
      }

      return (
        <div className='cursor-pointer hover:underline' onClick={() => setIsEditing(true)}>
          {(row.getValue('base_price') as number).toLocaleString()}
        </div>
      );
    },
  },
];
