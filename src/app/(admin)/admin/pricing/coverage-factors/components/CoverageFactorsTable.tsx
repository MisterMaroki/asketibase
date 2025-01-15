'use client';

import { DataTable } from '@/app/(admin)/admin/components/DataTable';
import { Tables } from '@/libs/supabase/types';

import { columns } from './columns';

interface CoverageFactorsTableProps {
  data: Tables<'coverage_factors'>[];
}

export function CoverageFactorsTable({ data }: CoverageFactorsTableProps) {
  return <DataTable columns={columns} data={data} />;
}
