'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { formatPriceWithCurrency } from '@/libs/membership/currency';
import { ColumnDef } from '@tanstack/react-table';

import { Membership, Quote } from '../../types';

export const columns: ColumnDef<Quote & { memberships: Membership }, any>[] = [
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('created_at')), 'PPP');
    },
  },
  {
    accessorKey: 'memberships.status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.memberships.status;
      return (
        <Badge variant='outline' className='capitalize'>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      const membership = row.original.memberships;
      if (!membership) return 'N/A';

      const primaryMember = membership?.members?.find((member) => member.is_primary);
      if (!primaryMember) return 'N/A';

      return (
        <div className='flex flex-col space-y-1'>
          <span className='font-medium'>
            {primaryMember.first_name} {primaryMember.last_name}
          </span>
          <span className='text-sm text-muted-foreground'>{primaryMember.email}</span>
        </div>
      );
    },
  },
  {
    id: 'coverage',
    header: 'Coverage',
    cell: ({ row }) => {
      const membership = row.original.memberships;
      if (!membership) return null;

      return (
        <div className='flex flex-col items-center space-y-1'>
          <Badge variant='outline' className='capitalize'>
            {membership.membership_type}
          </Badge>
          <Badge variant='outline' className='ml-2 capitalize'>
            {membership.coverage_type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'base_price',
    header: 'Base Price',
    cell: ({ row }) => {
      const currency = row.original.currency;
      const price = row.getValue('base_price') as number;
      return `${formatPriceWithCurrency(price, currency)}`;
    },
  },
  {
    accessorKey: 'tax_amount',
    header: 'Tax',
    cell: ({ row }) => {
      const currency = row.original.currency;
      const tax = row.getValue('tax_amount') as number;
      return `${formatPriceWithCurrency(tax, currency)}`;
    },
  },
  {
    accessorKey: 'total_price_with_tax',
    header: 'Total',
    cell: ({ row }) => {
      const currency = row.original.currency;
      const total = row.getValue('total_price_with_tax') as number;
      return `${formatPriceWithCurrency(total, currency)}`;
    },
  },
  {
    accessorKey: 'gbp_total',
    header: 'GBP Total',
    cell: ({ row }) => {
      const total = row.getValue('gbp_total') as number;
      return `${formatPriceWithCurrency(total, 'GBP')}`;
    },
  },
];
