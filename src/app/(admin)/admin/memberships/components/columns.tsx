'use client';

import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPriceWithCurrency } from '@/libs/membership/currency';
import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

type Member = Pick<
  Tables<'members'>,
  'id' | 'first_name' | 'last_name' | 'email' | 'contact_number' | 'date_of_birth' | 'nationality' | 'is_primary'
>;

type Quote = Pick<
  Tables<'quotes'>,
  | 'id'
  | 'created_at'
  | 'base_price'
  | 'tax_amount'
  | 'total_price_with_tax'
  | 'currency'
  | 'coverage_loading_price'
  | 'discount_amount'
  | 'gbp_total'
  | 'medical_loading_price'
  | 'member_prices'
  | 'total_price'
>;

type Membership = Tables<'memberships'> & {
  quotes: Quote[];
  members: Member[];
  users: {
    email: string;
  } | null;
};

export const columns: ColumnDef<Membership>[] = [
  {
    accessorKey: 'membership_number',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Membership Number
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const num = String(row.getValue('membership_number'));
      return <div className='pl-4 font-medium'>GOASK-J-98001/{num.padStart(4, '0')}</div>;
    },
    sortingFn: 'text',
  },
  {
    accessorKey: 'membership_type',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='pl-4'>
        <Badge variant='outline' className='capitalize'>
          {row.getValue('membership_type')}
        </Badge>
      </div>
    ),
    sortingFn: 'text',
  },
  {
    accessorKey: 'coverage_type',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Location Coverage
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='pl-4'>
        <Badge variant='outline' className='capitalize'>
          {row.getValue('coverage_type')}
        </Badge>
      </div>
    ),
    sortingFn: 'text',
  },
  {
    accessorKey: 'members',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Primary Member
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const members = row.getValue('members') as Member[];
      const primaryMember = members.find((member) => member.is_primary);
      return (
        <div className='pl-4'>{primaryMember ? `${primaryMember.first_name} ${primaryMember.last_name}` : '-'}</div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const membersA = rowA.getValue('members') as Member[];
      const membersB = rowB.getValue('members') as Member[];
      const primaryA = membersA.find((member) => member.is_primary);
      const primaryB = membersB.find((member) => member.is_primary);
      return (primaryA?.first_name || '').localeCompare(primaryB?.first_name || '');
    },
  },
  {
    accessorKey: 'members',
    id: 'member_count',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Members
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const members = row.getValue('members') as Member[];
      return <div className='pl-4'>{members.length}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const membersA = rowA.getValue('members') as Member[];
      const membersB = rowB.getValue('members') as Member[];
      return membersA.length - membersB.length;
    },
  },
  {
    accessorKey: 'quotes',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Latest Quote
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quotes = row.getValue('quotes') as Quote[];
      const latestQuote = quotes[0]; // Assuming quotes are ordered by created_at desc
      if (!latestQuote || latestQuote.gbp_total === null) return <div className='pl-4'>-</div>;

      return <div className='pl-4'>{formatPriceWithCurrency(latestQuote.gbp_total, 'GBP')}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const quotesA = rowA.getValue('quotes') as Quote[];
      const quotesB = rowB.getValue('quotes') as Quote[];
      const latestQuoteA = quotesA[0]?.gbp_total ?? 0;
      const latestQuoteB = quotesB[0]?.gbp_total ?? 0;
      return latestQuoteA - latestQuoteB;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='pl-4'>
        <Badge variant={row.getValue('status') === 'active' ? 'default' : 'secondary'} className='capitalize'>
          {row.getValue('status')}
        </Badge>
      </div>
    ),
    sortingFn: 'text',
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Created At
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='pl-4'>{format(new Date(row.getValue('created_at')), 'PPP')}</div>,
    sortingFn: 'datetime',
  },
];
