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
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CurrencyTotal {
  currency: string;
  total: number;
  gbpEquivalent: number;
  quotedTotal: number;
  quotedGbpEquivalent: number;
  writtenTotal: number;
  writtenGbpEquivalent: number;
  basePrice: number;
  quotedBasePrice: number;
  writtenBasePrice: number;
  medicalLoadingPrice: number;
  quotedMedicalLoadingPrice: number;
  writtenMedicalLoadingPrice: number;
  coverageLoadingPrice: number;
  quotedCoverageLoadingPrice: number;
  writtenCoverageLoadingPrice: number;
  discountAmount: number;
  quotedDiscountAmount: number;
  writtenDiscountAmount: number;
}

interface TaxTotal {
  currency: string;
  taxAmount: number;
  totalWithoutTax: number;
  taxRate: number;
  gbpEquivalent: number;
  quotedTaxAmount: number;
  quotedTotalWithoutTax: number;
  quotedGbpEquivalent: number;
  writtenTaxAmount: number;
  writtenTotalWithoutTax: number;
  writtenGbpEquivalent: number;
}

interface FinancialOverviewProps {
  currencyTotals: CurrencyTotal[];
  taxTotals: TaxTotal[];
}

export function FinancialOverview({ currencyTotals, taxTotals }: FinancialOverviewProps) {
  const [view, setView] = useState<'table' | 'chart'>('table');
  const [businessType, setBusinessType] = useState<'all' | 'quoted' | 'written'>('all');
  const [breakdownView, setBreakdownView] = useState<'summary' | 'detailed'>('summary');

  // Prepare data for the chart
  const chartData = currencyTotals.map((ct) => {
    const taxInfo = taxTotals.find((tt) => tt.currency === ct.currency);
    return {
      currency: ct.currency,
      total: ct.total,
      quotedTotal: ct.quotedTotal,
      writtenTotal: ct.writtenTotal,
      basePrice: ct.basePrice,
      quotedBasePrice: ct.quotedBasePrice,
      writtenBasePrice: ct.writtenBasePrice,
      medicalLoadingPrice: ct.medicalLoadingPrice,
      quotedMedicalLoadingPrice: ct.quotedMedicalLoadingPrice,
      writtenMedicalLoadingPrice: ct.writtenMedicalLoadingPrice,
      coverageLoadingPrice: ct.coverageLoadingPrice,
      quotedCoverageLoadingPrice: ct.quotedCoverageLoadingPrice,
      writtenCoverageLoadingPrice: ct.writtenCoverageLoadingPrice,
      discountAmount: ct.discountAmount,
      quotedDiscountAmount: ct.quotedDiscountAmount,
      writtenDiscountAmount: ct.writtenDiscountAmount,
      netAmount: taxInfo?.totalWithoutTax || 0,
      quotedNetAmount: taxInfo?.quotedTotalWithoutTax || 0,
      writtenNetAmount: taxInfo?.writtenTotalWithoutTax || 0,
      taxAmount: taxInfo?.taxAmount || 0,
      quotedTaxAmount: taxInfo?.quotedTaxAmount || 0,
      writtenTaxAmount: taxInfo?.writtenTaxAmount || 0,
      taxRate: taxInfo?.taxRate || 0,
      gbpEquivalent: ct.gbpEquivalent,
      quotedGbpEquivalent: ct.quotedGbpEquivalent,
      writtenGbpEquivalent: ct.writtenGbpEquivalent,
    };
  });

  // Calculate totals
  const calculateTotals = (data: typeof chartData) => {
    return data.reduce(
      (acc, curr) => {
        const relevantGbp =
          businessType === 'quoted'
            ? curr.quotedGbpEquivalent
            : businessType === 'written'
              ? curr.writtenGbpEquivalent
              : curr.gbpEquivalent;
        const relevantBasePrice =
          businessType === 'quoted'
            ? curr.quotedBasePrice
            : businessType === 'written'
              ? curr.writtenBasePrice
              : curr.basePrice;
        const relevantMedicalLoading =
          businessType === 'quoted'
            ? curr.quotedMedicalLoadingPrice
            : businessType === 'written'
              ? curr.writtenMedicalLoadingPrice
              : curr.medicalLoadingPrice;
        const relevantCoverageLoading =
          businessType === 'quoted'
            ? curr.quotedCoverageLoadingPrice
            : businessType === 'written'
              ? curr.writtenCoverageLoadingPrice
              : curr.coverageLoadingPrice;
        const relevantDiscount =
          businessType === 'quoted'
            ? curr.quotedDiscountAmount
            : businessType === 'written'
              ? curr.writtenDiscountAmount
              : curr.discountAmount;
        const relevantTax =
          businessType === 'quoted'
            ? curr.quotedTaxAmount
            : businessType === 'written'
              ? curr.writtenTaxAmount
              : curr.taxAmount;

        return {
          totalGbp: acc.totalGbp + relevantGbp,
          totalBasePrice: acc.totalBasePrice + relevantBasePrice,
          totalMedicalLoading: acc.totalMedicalLoading + relevantMedicalLoading,
          totalCoverageLoading: acc.totalCoverageLoading + relevantCoverageLoading,
          totalDiscount: acc.totalDiscount + relevantDiscount,
          totalTax: acc.totalTax + relevantTax,
          grandTotal: acc.grandTotal + relevantGbp,
        };
      },
      {
        totalGbp: 0,
        totalBasePrice: 0,
        totalMedicalLoading: 0,
        totalCoverageLoading: 0,
        totalDiscount: 0,
        totalTax: 0,
        grandTotal: 0,
      },
    );
  };

  const totals = calculateTotals(chartData);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-4'>
          <Tabs
            value={businessType}
            onValueChange={(value) => setBusinessType(value as 'all' | 'quoted' | 'written')}
            className='w-[400px]'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='all'>All Business</TabsTrigger>
              <TabsTrigger value='quoted'>Quoted</TabsTrigger>
              <TabsTrigger value='written'>Written</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs
            value={breakdownView}
            onValueChange={(value) => setBreakdownView(value as 'summary' | 'detailed')}
            className='w-[300px]'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='summary'>Summary</TabsTrigger>
              <TabsTrigger value='detailed'>Detailed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className='flex items-center space-x-2'>
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
      </div>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Premium (GBP)</div>
            <div className='mt-2 text-2xl font-bold'>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              }).format(totals.totalGbp)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Base Premium</div>
            <div className='mt-2 text-2xl font-bold'>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              }).format(totals.totalBasePrice)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Medical Loading</div>
            <div className='mt-2 text-2xl font-bold'>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              }).format(totals.totalMedicalLoading)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Coverage Loading</div>
            <div className='mt-2 text-2xl font-bold'>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              }).format(totals.totalCoverageLoading)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Discounts</div>
            <div className='mt-2 text-2xl font-bold text-green-600'>
              -
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              }).format(totals.totalDiscount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Tax</div>
            <div className='mt-2 text-2xl font-bold'>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                maximumFractionDigits: 0,
              }).format(totals.totalTax)}
            </div>
          </CardContent>
        </Card>
      </div>

      {view === 'table' ? (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='whitespace-nowrap'>Currency</TableHead>
                {breakdownView === 'detailed' ? (
                  <>
                    <TableHead className='whitespace-nowrap text-right'>Base Price</TableHead>
                    <TableHead className='whitespace-nowrap text-right'>Medical Loading</TableHead>
                    <TableHead className='whitespace-nowrap text-right'>Coverage Loading</TableHead>
                    <TableHead className='whitespace-nowrap text-right'>Discounts</TableHead>
                  </>
                ) : null}
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
              {chartData.map((data) => {
                const total =
                  businessType === 'quoted'
                    ? data.quotedTotal
                    : businessType === 'written'
                      ? data.writtenTotal
                      : data.total;
                const basePrice =
                  businessType === 'quoted'
                    ? data.quotedBasePrice
                    : businessType === 'written'
                      ? data.writtenBasePrice
                      : data.basePrice;
                const medicalLoading =
                  businessType === 'quoted'
                    ? data.quotedMedicalLoadingPrice
                    : businessType === 'written'
                      ? data.writtenMedicalLoadingPrice
                      : data.medicalLoadingPrice;
                const coverageLoading =
                  businessType === 'quoted'
                    ? data.quotedCoverageLoadingPrice
                    : businessType === 'written'
                      ? data.writtenCoverageLoadingPrice
                      : data.coverageLoadingPrice;
                const discount =
                  businessType === 'quoted'
                    ? data.quotedDiscountAmount
                    : businessType === 'written'
                      ? data.writtenDiscountAmount
                      : data.discountAmount;
                const taxAmount =
                  businessType === 'quoted'
                    ? data.quotedTaxAmount
                    : businessType === 'written'
                      ? data.writtenTaxAmount
                      : data.taxAmount;
                const netAmount =
                  businessType === 'quoted'
                    ? data.quotedNetAmount
                    : businessType === 'written'
                      ? data.writtenNetAmount
                      : data.netAmount;
                const gbpEquivalent =
                  businessType === 'quoted'
                    ? data.quotedGbpEquivalent
                    : businessType === 'written'
                      ? data.writtenGbpEquivalent
                      : data.gbpEquivalent;

                if (total === 0) return null;

                return (
                  <TableRow key={data.currency}>
                    <TableCell className='whitespace-nowrap font-medium'>{data.currency}</TableCell>
                    {breakdownView === 'detailed' ? (
                      <>
                        <TableCell className='whitespace-nowrap text-right'>
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                          }).format(basePrice)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-right'>
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                          }).format(medicalLoading)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-right'>
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                          }).format(coverageLoading)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-right text-green-600'>
                          -
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                          }).format(discount)}
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell className='whitespace-nowrap text-right'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: data.currency,
                      }).format(total)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: data.currency,
                      }).format(taxAmount)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: data.currency,
                      }).format(netAmount)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(gbpEquivalent)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell className='whitespace-nowrap font-medium'>Total (GBP)</TableCell>
                {breakdownView === 'detailed' ? (
                  <>
                    <TableCell className='whitespace-nowrap text-right font-bold'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(totals.totalBasePrice)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right font-bold'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(totals.totalMedicalLoading)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right font-bold'>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(totals.totalCoverageLoading)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap text-right font-bold text-green-600'>
                      -
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                      }).format(totals.totalDiscount)}
                    </TableCell>
                  </>
                ) : null}
                <TableCell className='whitespace-nowrap text-right font-bold'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(totals.grandTotal)}
                </TableCell>
                <TableCell className='whitespace-nowrap text-right font-bold'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(totals.totalTax)}
                </TableCell>
                <TableCell className='whitespace-nowrap text-right font-bold'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(totals.grandTotal - totals.totalTax)}
                </TableCell>
                <TableCell className='whitespace-nowrap text-right font-bold'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(totals.totalGbp)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='h-[400px] w-full sm:h-[450px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <RechartsBarChart
              data={chartData.filter((data) => {
                const relevantTotal =
                  businessType === 'quoted'
                    ? data.quotedTotal
                    : businessType === 'written'
                      ? data.writtenTotal
                      : data.total;
                return relevantTotal > 0;
              })}
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
                  const currency = name.includes('gbp') ? 'GBP' : props.payload.currency;
                  let label = name;
                  if (name.startsWith('quoted')) label = 'Quoted ' + name.replace('quoted', '');
                  if (name.startsWith('written')) label = 'Written ' + name.replace('written', '');
                  if (name === 'total') label = 'Total';
                  if (name === 'netAmount') label = 'Net';
                  if (name === 'taxAmount') label = 'Tax';
                  if (name === 'gbpEquivalent') label = 'GBP';
                  if (name === 'basePrice') label = 'Base Price';
                  if (name === 'medicalLoadingPrice') label = 'Medical Loading';
                  if (name === 'coverageLoadingPrice') label = 'Coverage Loading';
                  if (name === 'discountAmount') label = 'Discounts';

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
                  if (value.startsWith('quoted')) return 'Quoted ' + value.replace('quoted', '');
                  if (value.startsWith('written')) return 'Written ' + value.replace('written', '');
                  if (value === 'basePrice') return 'Base Price';
                  if (value === 'medicalLoadingPrice') return 'Medical Loading';
                  if (value === 'coverageLoadingPrice') return 'Coverage Loading';
                  if (value === 'discountAmount') return 'Discounts';
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
              {breakdownView === 'detailed' ? (
                <>
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedBasePrice'
                        : businessType === 'written'
                          ? 'writtenBasePrice'
                          : 'basePrice'
                    }
                    name='basePrice'
                    fill='#3b82f6'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedMedicalLoadingPrice'
                        : businessType === 'written'
                          ? 'writtenMedicalLoadingPrice'
                          : 'medicalLoadingPrice'
                    }
                    name='medicalLoadingPrice'
                    fill='#22c55e'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedCoverageLoadingPrice'
                        : businessType === 'written'
                          ? 'writtenCoverageLoadingPrice'
                          : 'coverageLoadingPrice'
                    }
                    name='coverageLoadingPrice'
                    fill='#f59e0b'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedDiscountAmount'
                        : businessType === 'written'
                          ? 'writtenDiscountAmount'
                          : 'discountAmount'
                    }
                    name='discountAmount'
                    fill='#10b981'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                </>
              ) : (
                <>
                  <Bar
                    dataKey={
                      businessType === 'quoted' ? 'quotedTotal' : businessType === 'written' ? 'writtenTotal' : 'total'
                    }
                    name='total'
                    fill='#3b82f6'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedNetAmount'
                        : businessType === 'written'
                          ? 'writtenNetAmount'
                          : 'netAmount'
                    }
                    name='netAmount'
                    fill='#22c55e'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedTaxAmount'
                        : businessType === 'written'
                          ? 'writtenTaxAmount'
                          : 'taxAmount'
                    }
                    name='taxAmount'
                    fill='#f59e0b'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                  <Bar
                    dataKey={
                      businessType === 'quoted'
                        ? 'quotedGbpEquivalent'
                        : businessType === 'written'
                          ? 'writtenGbpEquivalent'
                          : 'gbpEquivalent'
                    }
                    name='gbpEquivalent'
                    fill='#8b5cf6'
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.9}
                  />
                </>
              )}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
