import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, ClipboardList, PencilIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
}: QuoteSummaryProps) {
  console.log('🚀 ~ members:', members);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className=''>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
          <PencilIcon className='h-5 w-5 text-primary' />
          Quote Summary
        </CardTitle>
        <Button variant='ghost' size='sm' className='text-teal-400 hover:text-teal-300'>
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
            <div>
              <p className='text-sm text-gray-400'>Coverage Type</p>
              <p className='font-medium'>{coverageType}</p>
            </div>
            <div>
              <p className='text-sm text-gray-400'>Duration</p>
              <p className='font-medium'>{duration}</p>
            </div>
          </div>

          <div>
            <p className='mb-1 text-sm text-gray-400'>Coverage Period</p>
            <div className='rounded-md bg-muted/50 p-3'>
              <div className='flex justify-between text-sm'>
                <span>Start: {startDate}</span>
                <span>End: {endDate}</span>
              </div>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full '>
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
                            {currency} {member.countryPrice ? member.countryPrice.toFixed(2) : 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='text-gray-400'>Medical Premium</TableCell>
                          <TableCell className='text-right'>
                            {currency} {member.medicalFactor ? member.medicalFactor.toFixed(2) : 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className='font-medium'>Total Premium</TableCell>
                          <TableCell className='text-right font-medium'>
                            {currency} {member.total ? member.total.toFixed(2) : 0}
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
                <TableCell className='font-medium text-gray-400'>Total Premium</TableCell>
                <TableCell className='text-right font-medium'>
                  {currency} {totalPremium.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-gray-400'>Discount Applied</TableCell>
                <TableCell className='text-right text-teal-400'>
                  - {currency} {discountApplied.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='text-lg font-medium'>Final Premium</TableCell>
                <TableCell className='text-right text-lg font-bold text-teal-400'>
                  {currency} {finalPremium.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
