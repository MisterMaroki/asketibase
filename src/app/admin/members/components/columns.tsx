'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

import { MemberActions } from './MemberActions';

type Member = Tables<'members'> & {
  memberships: {
    membership_type: string;
    coverage_type: string;
    status: string;
  } | null;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'first_name',
    header: 'First Name',
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date of Birth',
    cell: ({ row }) => {
      return format(new Date(row.getValue('date_of_birth')), 'PPP');
    },
  },
  {
    accessorKey: 'nationality',
    header: 'Nationality',
  },
  {
    accessorKey: 'memberships',
    header: 'Coverage',
    cell: ({ row }) => {
      const membership = row.getValue('memberships') as Member['memberships'];
      if (!membership) return null;

      return (
        <div className='space-y-1'>
          <Badge variant='outline'>{membership.membership_type}</Badge>
          <Badge variant='outline' className='ml-2'>
            {membership.coverage_type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'is_primary',
    header: 'Role',
    cell: ({ row }) => {
      return row.getValue('is_primary') ? <Badge>Primary</Badge> : <Badge variant='secondary'>Dependent</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <MemberActions member={row.original} />,
  },
];
