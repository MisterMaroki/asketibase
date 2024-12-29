'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return <span className='font-mono text-xs'>{id.slice(0, 8)}...</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('created_at')), 'PPP');
    },
  },
  {
    accessorKey: 'users',
    header: 'Primary Email',
    cell: ({ row }) => {
      const user = row.getValue('users') as any;
      return user?.email || 'N/A';
    },
  },
  {
    accessorKey: 'membership_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('membership_type') as string;
      return <Badge variant='outline'>{type}</Badge>;
    },
  },
  {
    accessorKey: 'coverage_type',
    header: 'Coverage',
  },
  {
    accessorKey: 'members',
    header: 'Members',
    cell: ({ row }) => {
      const members = row.getValue('members') as any[];
      return members?.length || 0;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <Badge variant={status === 'draft' ? 'secondary' : 'default'}>{status}</Badge>;
    },
  },
];
