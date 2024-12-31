'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

import { MembershipActions } from './MembershipActions';

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

export const columns: ColumnDef<Membership, any>[] = [
  {
    accessorKey: 'membership_type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('membership_type')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'coverage_type',
    header: 'Coverage',
    cell: ({ row }) => {
      return (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('coverage_type')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'members',
    header: 'Members',
    cell: ({ row }) => {
      const members = row.getValue('members') as Member[];
      const primaryMember = members.find((member) => member.is_primary);
      if (!primaryMember) return null;

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
    accessorKey: 'start_date',
    header: 'Start Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('start_date')), 'PPP');
    },
  },
  {
    accessorKey: 'end_date',
    header: 'End Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('end_date')), 'PPP');
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('status')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <MembershipActions membership={row.original} />,
  },
];
