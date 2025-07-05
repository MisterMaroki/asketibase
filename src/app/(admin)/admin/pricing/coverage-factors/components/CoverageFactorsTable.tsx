'use client';

import { DataTable } from '@/app/(admin)/admin/pricing/components/DataTable';
import { Tables } from '@/libs/supabase/types';

import { columns } from './columns';

interface CoverageFactorsTableProps {
  data: Tables<'coverage_factors'>[];
}

export function CoverageFactorsTable({ data }: CoverageFactorsTableProps) {
  return <DataTable columns={columns} data={data} searchPlaceholder='Search coverage factors by location or type...' />;
}
