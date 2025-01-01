import React from 'react';
import { CalendarDaysIcon, ChevronDownIcon, ChevronUpIcon, ClipboardList, PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/libs/format-date';
import { formatPrice, formatPriceWithCurrency } from '@/libs/membership/currency';

interface MemberQuote {
  memberId: string;
  name: string;
  countryPrice: number;
  ageFactor: number;
  coverageFactor: number;
  medicalFactor: number;
  dailyTotal: number;
  total: number;
}

interface QuoteSummaryProps {
  currency: string;
  coverageType: string;
  duration: string;
  startDate: string;
  endDate: string;
  members: MemberQuote[];
  totalPremium: number;
  discountApplied: number;
  finalPremium: number;
  taxAmount: number;
  onPressEdit: () => void;
}

export default function QuoteSummary({
  currency,
  coverageType,
  duration,
  startDate,
  endDate,
  members,
  totalPremium,
  discountApplied,
  finalPremium,
  taxAmount,
  onPressEdit,
}: QuoteSummaryProps) {
  console.log('🚀 ~ duration:', duration);
  const [isOpen, setIsOpen] = React.useState(false);

  // Calculate the number of days
  const daysDifference =
    duration === 'single_trip'
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : duration === 'multi_trip'
        ? 45
        : 365;

  return (
    <Card className=''>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
          <PencilIcon className='h-5 w-5 text-primary' />
          Quote Summary
        </CardTitle>
        <Button variant='ghost' size='sm' className='text-teal-400 hover:text-teal-300' onClick={onPressEdit}>
          <PencilIcon className='mr-2 h-4 w-4' />
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-400'>Currency</p>
              <p className='font-medium'>{currency}</p>
            </div>
          </div>

          <div>
            <p className='mb-1 text-sm text-gray-400'>Coverage Period</p>
            <div className='rounded-md bg-muted/50 p-3'>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-between text-sm'>
                  <span>Start: {formatDate(new Date(startDate))}</span>
                  <span>End: {formatDate(new Date(endDate))}</span>
                </div>
                <div className='flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary'>
                  <CalendarDaysIcon className='h-4 w-4' />
                  <span>{daysDifference} days coverage</span>
                </div>
              </div>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full'>
            <CollapsibleTrigger asChild>
              <div className='mb-2 mt-4 flex w-full cursor-pointer items-center justify-between rounded-md bg-muted/50 p-2 text-sm font-medium text-primary transition-colors hover:bg-muted/70'>
                <span>Member Breakdown</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {members?.map((member, index) => (
                <Card key={index} className='mt-2'>
                  <CardHeader>
                    <CardTitle className='text-lg'>{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table className='p-0'>
                      <TableBody>
                        <TableRow>
                          <TableCell className='text-gray-400'>Base Premium</TableCell>
                          <TableCell className='text-right'>
                            {formatPriceWithCurrency(member.total - member.medicalFactor * daysDifference, currency)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='text-gray-400'>Medical Premium</TableCell>
                          <TableCell className='text-right'>
                            {formatPriceWithCurrency(member.medicalFactor * daysDifference, currency)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Total Premium</TableCell>
                          <TableCell className='text-right font-medium'>
                            {formatPriceWithCurrency(member.total, currency)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell className='font-medium text-gray-400'>
                  Subtotal <span className='text-gray-500'>(Pre Discount)</span>
                </TableCell>
                <TableCell className='text-right font-medium'>
                  {formatPriceWithCurrency(totalPremium, currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-gray-400'>Discount Applied</TableCell>
                <TableCell className='text-right text-teal-400'>
                  - {formatPriceWithCurrency(discountApplied, currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-medium text-gray-400'>
                  Subtotal <span className='text-gray-500'>(Discount Applied)</span>
                </TableCell>
                <TableCell className='text-right font-medium'>
                  {formatPriceWithCurrency(totalPremium - discountApplied, currency)}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className='font-medium text-gray-400'>
                  Tax <span className='text-gray-500'>(20%)</span>
                </TableCell>
                <TableCell className='text-right font-medium text-gray-500'>
                  {formatPriceWithCurrency(taxAmount, currency)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-lg font-medium'>Final Premium</TableCell>
                <TableCell className='whitespace-nowrap text-right text-lg font-bold text-teal-400'>
                  {formatPriceWithCurrency(finalPremium, currency)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
