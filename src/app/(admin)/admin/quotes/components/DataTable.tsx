'use client';

import { DataTable as BaseDataTable } from '@/app/(admin)/admin/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  return (
    <BaseDataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      from='quotes'
      pageSize={20}
      searchPlaceholder='Search quotes by price, status, or member...'
    />
  );
}
