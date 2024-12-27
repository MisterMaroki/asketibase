'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { getCurrencySymbol } from '@/libs/membership/currency';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('created_at')), 'PPP');
    },
  },
  {
    accessorKey: 'membership_id',
    header: 'Customer',
    cell: ({ row }) => {
      const membershipId = row.getValue('membership_id') as string;
      return membershipId || 'N/A';
    },
  },
  {
    accessorKey: 'coverage_loading_price',
    header: 'Coverage',
    cell: ({ row }) => {
      const coverageLoadingPrice = row.getValue('coverage_loading_price') as number;
      return (
        <div className='space-y-1'>
          <Badge variant='outline'>{coverageLoadingPrice}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'base_price',
    header: 'Base Price',
    cell: ({ row }) => {
      const currency = row.original.currency as string;
      const price = row.getValue('base_price') as number;
      return `${getCurrencySymbol(currency)}${price.toLocaleString()}`;
    },
  },
  {
    accessorKey: 'medical_loading_price',
    header: 'Medical Loading',
    cell: ({ row }) => {
      const currency = row.original.currency as string;
      const price = row.getValue('medical_loading_price') as number;
      return `${getCurrencySymbol(currency)}${price.toLocaleString()}`;
    },
  },
  {
    accessorKey: 'discount_amount',
    header: 'Discount',
    cell: ({ row }) => {
      const currency = row.original.currency as string;
      const amount = row.getValue('discount_amount') as number;
      return amount > 0 ? (
        <span className='text-green-500'>
          -${getCurrencySymbol(currency)}
          {amount.toLocaleString()}
        </span>
      ) : (
        '-'
      );
    },
  },
  {
    accessorKey: 'total_price',
    header: 'Total',
    cell: ({ row }) => {
      const currency = row.original.currency as string;
      const total = row.getValue('total_price') as number;
      return (
        <span className='font-medium'>
          {getCurrencySymbol(currency)}
          {total.toLocaleString()}
        </span>
      );
    },
  },
];
