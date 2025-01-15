'use client';

import { Tables } from '@/libs/supabase/types';
import { ColumnDef } from '@tanstack/react-table';

import { EditableCell } from './EditableCell';

type CoverageFactor = Tables<'coverage_factors'>;

export const columns: ColumnDef<CoverageFactor>[] = [
  {
    accessorKey: 'coverage_type',
    header: 'Coverage Type',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('coverage_type')}</div>,
  },
  {
    accessorKey: 'daily_rate',
    header: 'Daily Rate',
    cell: ({ row }) => <EditableCell id={row.original.id} value={row.getValue('daily_rate')} field='daily_rate' />,
  },
];
