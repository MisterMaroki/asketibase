'use client';

import { DataTable } from '@/app/(admin)/admin/pricing/components/DataTable';
import { Tables } from '@/libs/supabase/types';

import { columns } from './columns';

interface CountryBasePricesTableProps {
  data: Tables<'country_base_prices'>[];
}

export function CountryBasePricesTable({ data }: CountryBasePricesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={50}
      searchPlaceholder='Search countries by name or currency...'
    />
  );
}
