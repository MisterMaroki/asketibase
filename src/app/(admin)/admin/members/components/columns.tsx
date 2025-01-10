'use client';

import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

type Member = Tables<'members'> & {
  memberships: {
    id: string;
    membership_type: string;
    coverage_type: string;
    status: string;
    quotes: Tables<'quotes'>[];
  } | null;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          First Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('first_name')}</div>,
    sortingFn: 'text',
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Last Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('last_name')}</div>,
    sortingFn: 'text',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('email')}</div>,
    sortingFn: 'text',
  },
  {
    accessorKey: 'date_of_birth',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Date of Birth
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='pl-4'>{format(new Date(row.getValue('date_of_birth')), 'PPP')}</div>,
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'nationality',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Nationality
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('nationality')}</div>,
    sortingFn: 'text',
  },
  {
    accessorKey: 'memberships',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Coverage
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const membership = row.getValue('memberships') as Member['memberships'];
      if (!membership) return <div className='pl-4'>-</div>;

      return (
        <div className='space-y-1 pl-4'>
          <Badge variant='outline' className='capitalize'>
            {membership.membership_type}
          </Badge>
          <Badge variant='outline' className='ml-2 capitalize'>
            {membership.coverage_type}
          </Badge>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const membershipA = (rowA.getValue('memberships') as Member['memberships'])?.membership_type || '';
      const membershipB = (rowB.getValue('memberships') as Member['memberships'])?.membership_type || '';
      return membershipA.localeCompare(membershipB);
    },
  },
  {
    accessorKey: 'memberships',
    id: 'membership_status',
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
    cell: ({ row }) => {
      const membership = row.getValue('memberships') as Member['memberships'];
      return (
        <div className='pl-4'>
          {!membership ? (
            <Badge variant='secondary'>No Membership</Badge>
          ) : (
            <Badge variant={membership.status === 'active' ? 'default' : 'secondary'} className='capitalize'>
              {membership.status}
            </Badge>
          )}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const statusA = (rowA.getValue('memberships') as Member['memberships'])?.status || '';
      const statusB = (rowB.getValue('memberships') as Member['memberships'])?.status || '';
      return statusA.localeCompare(statusB);
    },
  },
  {
    accessorKey: 'is_primary',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='w-full justify-start font-medium hover:bg-transparent'
        >
          Role
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='pl-4'>
        {row.getValue('is_primary') ? <Badge>Primary</Badge> : <Badge variant='secondary'>Dependent</Badge>}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as boolean;
      const b = rowB.getValue(columnId) as boolean;
      return a === b ? 0 : a ? -1 : 1;
    },
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
