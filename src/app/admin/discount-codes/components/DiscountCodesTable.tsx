'use client';

import { DataTable } from '@/app/admin/components/DataTable';
import { Tables } from '@/libs/supabase/types';

import { columns } from './columns';

interface DiscountCodesTableProps {
  data: Tables<'fires'>[];
}

export function DiscountCodesTable({ data }: DiscountCodesTableProps) {
  return <DataTable columns={columns} data={data} />;
}
