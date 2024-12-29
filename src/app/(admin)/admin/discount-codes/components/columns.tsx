'use client';

import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

import { DiscountCodeActions } from './DiscountCodeActions';

export const columns: ColumnDef<Tables<'fires'>>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'discount_percent',
    header: 'Discount',
    cell: ({ row }) => {
      const percent = row.getValue('discount_percent') as number;
      return <span>{percent}%</span>;
    },
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('active') as boolean;
      return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return <span>{format(new Date(date), 'MMM d, yyyy')}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const code = row.original;
      return <DiscountCodeActions code={code} />;
    },
  },
];
