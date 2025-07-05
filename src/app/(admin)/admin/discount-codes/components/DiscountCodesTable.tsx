'use client';

import { DataTable } from '@/app/(admin)/admin/components/DataTable';
import { Tables } from '@/libs/supabase/types';

import { columns } from './columns';

interface DiscountCodesTableProps {
  data: Tables<'fires'>[];
}

export function DiscountCodesTable({ data }: DiscountCodesTableProps) {
  return (
    <DataTable columns={columns} data={data} searchPlaceholder='Search discount codes by name, code, or status...' />
  );
}
