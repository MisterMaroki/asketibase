'use client';

import { ArrowDownRight, ArrowRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConversionFunnelStats {
  period: string;
  viewEligibility: number;
  acceptEligibility: number;
  draftMemberships: number;
  convertedCustomers: number;
  viewToAcceptRate: number;
  acceptToQuoteRate: number;
  quoteToCustomerRate: number;
  overallConversionRate: number;
}

interface ConversionFunnelProps {
  stats: ConversionFunnelStats[];
}

export function ConversionFunnel({ stats }: ConversionFunnelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={stats[0].period} className='space-y-4'>
          <TabsList className='grid w-full grid-cols-3'>
            {stats.map((stat) => (
              <TabsTrigger key={stat.period} value={stat.period} className='text-xs sm:text-sm'>
                {stat.period}
              </TabsTrigger>
            ))}
          </TabsList>
          {stats.map((stat) => (
            <TabsContent key={stat.period} value={stat.period}>
              <div className='space-y-6'>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
                  <div className='space-y-2 rounded-lg border p-3 text-center sm:p-4'>
                    <div className='text-lg font-bold sm:text-2xl'>{stat.viewEligibility}</div>
                    <div className='text-xs text-muted-foreground sm:text-sm'>Form Views</div>
                  </div>
                  <div className='space-y-2 rounded-lg border p-3 text-center sm:p-4'>
                    <div className='text-lg font-bold sm:text-2xl'>{stat.acceptEligibility}</div>
                    <div className='text-xs text-muted-foreground sm:text-sm'>Eligibility Accepted</div>
                  </div>
                  <div className='space-y-2 rounded-lg border p-3 text-center sm:p-4'>
                    <div className='text-lg font-bold sm:text-2xl'>{stat.draftMemberships}</div>
                    <div className='text-xs text-muted-foreground sm:text-sm'>Quotes Generated</div>
                  </div>
                  <div className='space-y-2 rounded-lg border p-3 text-center sm:p-4'>
                    <div className='text-lg font-bold sm:text-2xl'>{stat.convertedCustomers}</div>
                    <div className='text-xs text-muted-foreground sm:text-sm'>Converted Customers</div>
                  </div>
                </div>
                <div className='rounded-lg border sm:border-0'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='whitespace-nowrap py-3 text-xs sm:py-4 sm:text-sm'>
                          Conversion Step
                        </TableHead>
                        <TableHead className='whitespace-nowrap py-3 text-right text-xs sm:py-4 sm:text-sm'>
                          Rate
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='text-xs sm:text-sm'>
                      <TableRow>
                        <TableCell className='flex items-center gap-1 py-3 sm:gap-2 sm:py-4'>
                          <span className='whitespace-nowrap'>Form Views</span>
                          <ArrowRight className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                          <span className='whitespace-nowrap'>Eligibility</span>
                        </TableCell>
                        <TableCell className='whitespace-nowrap py-3 text-right sm:py-4'>
                          {stat.viewToAcceptRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center gap-1 py-3 sm:gap-2 sm:py-4'>
                          <span className='whitespace-nowrap'>Eligibility</span>
                          <ArrowRight className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                          <span className='whitespace-nowrap'>Quote</span>
                        </TableCell>
                        <TableCell className='whitespace-nowrap py-3 text-right sm:py-4'>
                          {stat.acceptToQuoteRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='flex items-center gap-1 py-3 sm:gap-2 sm:py-4'>
                          <span className='whitespace-nowrap'>Quote</span>
                          <ArrowRight className='h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4' />
                          <span className='whitespace-nowrap'>Customer</span>
                        </TableCell>
                        <TableCell className='whitespace-nowrap py-3 text-right sm:py-4'>
                          {stat.quoteToCustomerRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className='whitespace-nowrap py-3 font-bold sm:py-4'>Overall Rate</TableCell>
                        <TableCell className='whitespace-nowrap py-3 text-right font-bold sm:py-4'>
                          {stat.overallConversionRate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
