'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { ColumnDef, SortingState } from '@tanstack/react-table';

import { DataTable } from './DataTable';
import { LogDialog } from './LogDialog';

interface Log {
  id: string;
  level: string;
  operation: string;
  details: Record<string, any>;
  error: string | null;
  timestamp: string;
}

interface OperationCount {
  operation: string;
  count: number;
  level: string;
}

function LogsOverview({
  data,
  onOperationClick,
  activeFilters,
}: {
  data: Log[];
  onOperationClick: (operation: string) => void;
  activeFilters: Set<string>;
}) {
  const operationCounts = data.reduce<OperationCount[]>((acc, log) => {
    const existing = acc.find((item) => item.operation === log.operation);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ operation: log.operation, count: 1, level: log.level });
    }
    return acc;
  }, []);

  operationCounts.sort((a, b) => b.count - a.count);

  return (
    <div className='space-y-4'>
      {activeFilters.size > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Filtered by:</span>
          <div className='flex flex-wrap gap-2'>
            {Array.from(activeFilters).map((filter) => (
              <Badge key={filter} variant='secondary' className='gap-1'>
                {filter}
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-4 w-4 p-0 hover:bg-transparent'
                  onClick={() => onOperationClick(filter)}
                >
                  <X className='h-3 w-3' />
                </Button>
              </Badge>
            ))}
            {activeFilters.size > 1 && (
              <Button
                variant='ghost'
                size='sm'
                className='h-6 px-2 text-xs'
                onClick={() => {
                  activeFilters.forEach((filter) => onOperationClick(filter));
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}
      <Card className='mb-6'>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
            {operationCounts.map(({ operation, count, level }) => {
              const isSelected = activeFilters.has(operation);
              return (
                <button
                  key={operation}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3 transition-colors',
                    isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50',
                  )}
                  onClick={() => onOperationClick(operation)}
                >
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant={level === 'error' ? 'destructive' : level === 'warn' ? 'secondary' : 'default'}
                      className='capitalize'
                    >
                      {level}
                    </Badge>
                    <span className='font-medium'>{operation}</span>
                  </div>
                  <span className='text-sm text-muted-foreground'>{count}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: 'level',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4'>
          Level
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const level = row.getValue('level') as string;
      const variant = level === 'error' ? 'destructive' : level === 'warn' ? 'secondary' : 'default';

      return (
        <Badge variant={variant} className='capitalize'>
          {level}
        </Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      const levelOrder = { error: 0, warn: 1, info: 2 };
      const a = rowA.getValue('level') as string;
      const b = rowB.getValue('level') as string;
      return (levelOrder[a as keyof typeof levelOrder] || 3) - (levelOrder[b as keyof typeof levelOrder] || 3);
    },
  },
  {
    accessorKey: 'operation',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4'>
          Operation
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4'>
          Timestamp
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return format(new Date(row.getValue('timestamp')), 'PPpp');
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.getValue('timestamp')).getTime();
      const b = new Date(rowB.getValue('timestamp')).getTime();
      return a - b;
    },
  },
];

interface LogsTableProps {
  data: Log[];
  isLoading?: boolean;
}

export function LogsTable({ data, isLoading }: LogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [operationFilters, setOperationFilters] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true }, // Default sort: newest first
  ]);

  const toggleFilter = (operation: string) => {
    const newFilters = new Set(operationFilters);
    if (newFilters.has(operation)) {
      newFilters.delete(operation);
    } else {
      newFilters.add(operation);
    }
    setOperationFilters(newFilters);
  };

  const filteredData = operationFilters.size > 0 ? data.filter((log) => operationFilters.has(log.operation)) : data;

  return (
    <>
      <LogsOverview data={data} onOperationClick={toggleFilter} activeFilters={operationFilters} />
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        onRowClick={(row) => setSelectedLog(row)}
        pageSize={100}
        sorting={sorting}
        onSortingChange={setSorting}
        searchPlaceholder='Search logs by operation, level, or timestamp...'
      />
      <LogDialog log={selectedLog} open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)} />
    </>
  );
}
