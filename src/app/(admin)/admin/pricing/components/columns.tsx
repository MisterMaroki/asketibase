'use client';

import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

import { EditableCell } from './EditableCell';

type CountryBasePrice = Tables<'country_base_prices'>;

export const columns: ColumnDef<CountryBasePrice>[] = [
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => {
      return <div>{row.getValue('country')}</div>;
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
    cell: ({ row }) => (
      <EditableCell id={row.original.id} value={row.getValue('base_price')} field='base_price' type='number' />
    ),
  },
];
