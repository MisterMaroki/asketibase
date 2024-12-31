'use client';

import { useState } from 'react';
import { BarChart, Info, LineChart } from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CurrencyTotal {
  currency: string;
  total: number;
  gbpEquivalent: number;
}

interface TaxTotal {
  currency: string;
  taxAmount: number;
  totalWithoutTax: number;
  taxRate: number;
  gbpEquivalent: number;
}

interface FinancialOverviewProps {
  currencyTotals: CurrencyTotal[];
  taxTotals: TaxTotal[];
}

export function FinancialOverview({ currencyTotals, taxTotals }: FinancialOverviewProps) {
  const [view, setView] = useState<'table' | 'chart'>('table');

  // Prepare data for the chart
  const chartData = currencyTotals.map((ct) => {
    const taxInfo = taxTotals.find((tt) => tt.currency === ct.currency);
    return {
      currency: ct.currency,
      total: ct.total,
      netAmount: taxInfo?.totalWithoutTax || 0,
      taxAmount: taxInfo?.taxAmount || 0,
      taxRate: taxInfo?.taxRate || 0,
      gbpEquivalent: ct.gbpEquivalent,
    };
  });

  // Calculate total GBP equivalent
  const totalGbpEquivalent = currencyTotals.reduce((acc, curr) => acc + curr.gbpEquivalent, 0);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end space-x-2'>
        <Button
          variant={view === 'table' ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => setView('table')}
          className='h-8 w-8 p-0'
        >
          <LineChart className='h-4 w-4' />
        </Button>
        <Button
          variant={view === 'chart' ? 'secondary' : 'ghost'}
          size='sm'
          onClick={() => setView('chart')}
          className='h-8 w-8 p-0'
        >
          <BarChart className='h-4 w-4' />
        </Button>
      </div>

      {view === 'table' ? (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='whitespace-nowrap'>Currency</TableHead>
                <TableHead className='whitespace-nowrap text-right'>Total Amount</TableHead>
                <TableHead className='whitespace-nowrap text-right'>Tax Amount</TableHead>
                <TableHead className='whitespace-nowrap text-right'>Net Amount</TableHead>
                <TableHead className='whitespace-nowrap text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    GBP Equivalent
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-4 w-4 p-0'>
                            <Info className='h-3 w-3' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>GBP equivalent amount stored at the time of quote creation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data) => (
                <TableRow key={data.currency}>
                  <TableCell className='whitespace-nowrap font-medium'>{data.currency}</TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: data.currency,
                    }).format(data.total)}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: data.currency,
                    }).format(data.taxAmount)}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: data.currency,
                    }).format(data.netAmount)}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: 'GBP',
                    }).format(data.gbpEquivalent)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className='whitespace-nowrap font-medium'>Total (GBP)</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell className='whitespace-nowrap text-right font-bold'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(totalGbpEquivalent)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='h-[400px] w-full sm:h-[450px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barSize={40}
              maxBarSize={50}
            >
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f0f0f0' />
              <XAxis
                dataKey='currency'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666666', fontSize: 12 }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666666', fontSize: 12 }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-GB', {
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
                width={60}
              />
              <RechartsTooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
                formatter={(value: number, name: string, props: any) => {
                  const currency = name === 'gbpEquivalent' ? 'GBP' : props.payload.currency;
                  const label =
                    name === 'total' ? 'Total' : name === 'netAmount' ? 'Net' : name === 'taxAmount' ? 'Tax' : 'GBP';
                  return [
                    new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(value),
                    label,
                  ];
                }}
                labelFormatter={(label) => `Currency: ${label}`}
              />
              <Legend
                verticalAlign='top'
                height={36}
                iconType='circle'
                iconSize={8}
                formatter={(value) => {
                  return value === 'total'
                    ? 'Total'
                    : value === 'netAmount'
                      ? 'Net'
                      : value === 'taxAmount'
                        ? 'Tax'
                        : 'GBP';
                }}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar dataKey='total' name='total' fill='#3b82f6' radius={[4, 4, 0, 0]} fillOpacity={0.9} />
              <Bar dataKey='netAmount' name='netAmount' fill='#22c55e' radius={[4, 4, 0, 0]} fillOpacity={0.9} />
              <Bar dataKey='taxAmount' name='taxAmount' fill='#f59e0b' radius={[4, 4, 0, 0]} fillOpacity={0.9} />
              <Bar
                dataKey='gbpEquivalent'
                name='gbpEquivalent'
                fill='#8b5cf6'
                radius={[4, 4, 0, 0]}
                fillOpacity={0.9}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
