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
import { formatPriceWithCurrency } from '@/libs/membership/currency';

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
  exchange_rate: number;
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
  exchange_rate: number;
}

interface FinancialOverviewProps {
  currencyTotals: CurrencyTotal[];
  taxTotals: TaxTotal[];
}

export function FinancialOverview({ currencyTotals, taxTotals }: FinancialOverviewProps) {
  const [businessType, setBusinessType] = useState<'quoted' | 'written'>('written');
  const [breakdownView, setBreakdownView] = useState<'summary' | 'detailed'>('detailed');

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
      exchange_rate: ct.exchange_rate,
    };
  });

  // Calculate totals
  const calculateTotals = (data: typeof chartData) => {
    return data.reduce(
      (acc, curr) => {
        const relevantTotal = businessType === 'quoted' ? curr.quotedTotal : curr.writtenTotal;
        const relevantBasePrice = businessType === 'quoted' ? curr.quotedBasePrice : curr.writtenBasePrice;
        const relevantMedicalLoading =
          businessType === 'quoted' ? curr.quotedMedicalLoadingPrice : curr.writtenMedicalLoadingPrice;
        const relevantCoverageLoading =
          businessType === 'quoted' ? curr.quotedCoverageLoadingPrice : curr.writtenCoverageLoadingPrice;
        const relevantDiscount = businessType === 'quoted' ? curr.quotedDiscountAmount : curr.writtenDiscountAmount;
        const relevantTax = businessType === 'quoted' ? curr.quotedTaxAmount : curr.writtenTaxAmount;

        // Convert to GBP using the stored exchange rate
        const exchangeRate = curr.exchange_rate || 1;
        const gbpTotal = relevantTotal / exchangeRate;
        const gbpBasePrice = relevantBasePrice / exchangeRate;
        const gbpMedicalLoading = relevantMedicalLoading / exchangeRate;
        const gbpCoverageLoading = relevantCoverageLoading / exchangeRate;
        const gbpDiscount = relevantDiscount / exchangeRate;
        const gbpTax = relevantTax / exchangeRate;

        return {
          totalGbp: acc.totalGbp + gbpTotal,
          totalBasePrice: acc.totalBasePrice + gbpBasePrice,
          totalMedicalLoading: acc.totalMedicalLoading + gbpMedicalLoading,
          totalCoverageLoading: acc.totalCoverageLoading + gbpCoverageLoading,
          totalDiscount: acc.totalDiscount + gbpDiscount,
          totalTax: acc.totalTax + gbpTax,
          grandTotal: acc.grandTotal + relevantTotal,
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
          <Tabs value={businessType} onValueChange={(value) => setBusinessType(value as 'quoted' | 'written')}>
            <TabsList className='w-full'>
              <TabsTrigger value='written'>Written</TabsTrigger>
              <TabsTrigger value='quoted'>Quoted</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={breakdownView} onValueChange={(value) => setBreakdownView(value as 'summary' | 'detailed')}>
            <TabsList className='w-full'>
              <TabsTrigger value='summary'>Summary</TabsTrigger>
              <TabsTrigger value='detailed'>Detailed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Premium (GBP)</div>
            <div className='mt-2 text-2xl font-bold'>{formatPriceWithCurrency(totals.totalGbp, 'GBP')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Net (GBP)</div>
            <div className='mt-2 text-2xl font-bold'>
              {formatPriceWithCurrency(totals.totalGbp - totals.totalTax, 'GBP')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Base Premium</div>
            <div className='mt-2 text-2xl font-bold'>{formatPriceWithCurrency(totals.totalBasePrice, 'GBP')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Medical Loading</div>
            <div className='mt-2 text-2xl font-bold'>{formatPriceWithCurrency(totals.totalMedicalLoading, 'GBP')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Coverage Loading</div>
            <div className='mt-2 text-2xl font-bold'>{formatPriceWithCurrency(totals.totalCoverageLoading, 'GBP')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Discounts</div>
            <div className='mt-2 text-2xl font-bold text-green-600'>
              -{formatPriceWithCurrency(totals.totalDiscount, 'GBP')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-sm font-medium text-muted-foreground'>Total Tax</div>
            <div className='mt-2 text-2xl font-bold'>{formatPriceWithCurrency(totals.totalTax, 'GBP')}</div>
          </CardContent>
        </Card>
      </div>

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
                        <p>
                          GBP equivalent amounts are calculated at the time of quote creation. They are not updated when
                          the exchange rate changes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartData.map((data) => {
              const total = businessType === 'quoted' ? data.quotedTotal : data.writtenTotal;
              const basePrice = businessType === 'quoted' ? data.quotedBasePrice : data.writtenBasePrice;
              const medicalLoading =
                businessType === 'quoted' ? data.quotedMedicalLoadingPrice : data.writtenMedicalLoadingPrice;
              const coverageLoading =
                businessType === 'quoted' ? data.quotedCoverageLoadingPrice : data.writtenCoverageLoadingPrice;
              const discount = businessType === 'quoted' ? data.quotedDiscountAmount : data.writtenDiscountAmount;
              const taxAmount = businessType === 'quoted' ? data.quotedTaxAmount : data.writtenTaxAmount;
              const netAmount = businessType === 'quoted' ? data.quotedNetAmount : data.writtenNetAmount;
              const gbpEquivalent = businessType === 'quoted' ? data.quotedGbpEquivalent : data.writtenGbpEquivalent;

              if (total === 0) return null;

              return (
                <TableRow key={data.currency}>
                  <TableCell className='whitespace-nowrap font-medium'>{data.currency}</TableCell>
                  {breakdownView === 'detailed' ? (
                    <>
                      <TableCell className='whitespace-nowrap text-right'>
                        {formatPriceWithCurrency(basePrice, data.currency)}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-right'>
                        {formatPriceWithCurrency(medicalLoading, data.currency)}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-right'>
                        {formatPriceWithCurrency(coverageLoading, data.currency)}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-right text-green-600'>
                        -{formatPriceWithCurrency(discount, data.currency)}
                      </TableCell>
                    </>
                  ) : null}
                  <TableCell className='whitespace-nowrap text-right'>
                    {formatPriceWithCurrency(total, data.currency)}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {formatPriceWithCurrency(taxAmount, data.currency)}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {formatPriceWithCurrency(netAmount, data.currency)}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right'>
                    {formatPriceWithCurrency(netAmount / (data.exchange_rate || 1), 'GBP')}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell className='whitespace-nowrap font-medium'>Total (GBP)</TableCell>
              {breakdownView === 'detailed' ? (
                <>
                  <TableCell className='whitespace-nowrap text-right font-bold'>
                    {formatPriceWithCurrency(totals.totalBasePrice, 'GBP')}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right font-bold'>
                    {formatPriceWithCurrency(totals.totalMedicalLoading, 'GBP')}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right font-bold'>
                    {formatPriceWithCurrency(totals.totalCoverageLoading, 'GBP')}
                  </TableCell>
                  <TableCell className='whitespace-nowrap text-right font-bold text-green-600'>
                    -{formatPriceWithCurrency(totals.totalDiscount, 'GBP')}
                  </TableCell>
                </>
              ) : null}
              <TableCell className='whitespace-nowrap text-right font-bold'>
                {formatPriceWithCurrency(totals.totalGbp, 'GBP')}
              </TableCell>
              <TableCell className='whitespace-nowrap text-right font-bold'>
                {formatPriceWithCurrency(totals.totalTax, 'GBP')}
              </TableCell>
              <TableCell className='whitespace-nowrap text-right font-bold'>
                {formatPriceWithCurrency(totals.totalGbp - totals.totalTax, 'GBP')}
              </TableCell>
              <TableCell className='whitespace-nowrap text-right font-bold'>
                {formatPriceWithCurrency(totals.totalGbp - totals.totalTax, 'GBP')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
