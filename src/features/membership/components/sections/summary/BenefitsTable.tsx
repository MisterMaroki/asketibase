'use client';

import { useState } from 'react';
import { ChevronDown, Fish, HeartPulse, Shield, Snowflake, Waves } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const KEY_BENEFITS = [
  {
    icon: HeartPulse,
    text: 'Up to $10M Medical Coverage',
    subtext: 'Including Emergency Evacuation',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    ringColor: 'ring-rose-200',
  },
  {
    icon: Snowflake,
    text: 'Winter Sports Cover',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    ringColor: 'ring-blue-200',
  },
  {
    icon: Waves,
    text: 'Cruise Cover',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
    ringColor: 'ring-cyan-200',
  },
  {
    icon: Fish,
    text: 'Dive Cover',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    ringColor: 'ring-emerald-200',
  },
];

const BENEFITS_DATA = [
  {
    benefit: 'Cancellation or Curtailment',
    amount: 'Up to $1,500',
    excess: '$100',
  },
  {
    benefit: 'Emergency Medical, Repatriation & Evacuation Expenses',
    amount: 'Up to $10,000,000',
    excess: '$100',
    highlight: true,
  },
  {
    benefit: 'Hospital Confinement Benefit',
    amount: '$10 per 24 hours up to a maximum of $500',
    excess: '$100',
  },
  {
    benefit: 'Personal Accident; Accidental Death',
    amount: 'Up to $10,000 ($1,500 if under 18 or over 69)',
    excess: '$100',
  },
  {
    benefit: 'Personal Accident; Loss of Limb or Sight',
    amount: 'Up to $10,000 ($1,500 if under 18 or over 69)',
    excess: '$100',
  },
  {
    benefit: 'Personal Accident; Permanent Total Disablement',
    amount: 'Up to $10,000 ($1,500 if under 18 or over 69)',
    excess: '$100',
  },
  {
    benefit: 'Missed Departure',
    amount: 'Up to $500',
    excess: '$100',
  },
  {
    benefit: 'Baggage',
    amount: 'Up to $1,000',
    excess: '$100',
  },
  {
    benefit: 'Single Article/Pair/Set Limit',
    amount: 'Up to $150',
    excess: '$100',
  },
  {
    benefit: 'Total Valuable Limit',
    amount: 'Up to $150',
    excess: '$100',
  },
  {
    benefit: 'Spectacles/Sunglasses Limit',
    amount: 'Up to $150',
    excess: '$100',
  },
  {
    benefit: 'Personal Money, Passports, Documents',
    amount:
      'Up to $250\nCash limit carried on any one Member limited to $250\nPassport, Tickets & Documents Up to $100',
    excess: '$50',
  },
  {
    benefit: 'Personal Liability',
    amount: 'Up to $20,000',
    excess: '$100',
  },
  {
    benefit: 'Rented Accommodation',
    amount: 'Up to $2,000',
    excess: '$100',
  },
  {
    benefit: 'Legal Expenses & Assistance',
    amount: 'Up to $2,000',
    excess: '$100',
  },
  {
    benefit: 'Cruise Cover',
    amount: 'Included',
    excess: '',
  },
  {
    benefit: 'Winter Sports Cover',
    amount: 'Included',
    excess: '',
  },
  {
    benefit: 'Dive Cover',
    amount: 'Included',
    excess: '',
  },
];

export function BenefitsTable() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className='w-full overflow-hidden bg-gradient-to-br from-card/30 to-muted/10'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className='cursor-pointer space-y-6 p-4 transition-colors hover:bg-muted/50 sm:p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-start gap-3 sm:items-center'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/10 sm:h-9 sm:w-9'>
                  <Shield className='h-5 w-5 text-primary' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='font-semibold leading-none tracking-tight'>Membership Benefits</h3>
                  <p className='mt-1.5 text-sm text-muted-foreground sm:mt-1'>
                    Comprehensive coverage for your adventures
                  </p>
                </div>
              </div>
              <Button variant='ghost' size='sm' className='w-full justify-between gap-2 font-medium sm:w-auto'>
                {isOpen ? 'Show Less' : 'View All Benefits'}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {!isOpen && (
              <div className='space-y-8'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {KEY_BENEFITS.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={index}
                        className='group relative flex items-center gap-4 rounded-lg border bg-card p-4 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5'
                      >
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${benefit.bgColor} p-2.5 ring-1 ${benefit.ringColor} transition-colors group-hover:bg-card group-hover:ring-primary/20`}
                        >
                          <Icon className={`h-7 w-7 ${benefit.color}`} />
                        </div>
                        <div className='flex flex-col gap-1'>
                          <span className='font-medium leading-tight'>{benefit.text}</span>
                          <span className='text-sm text-muted-foreground'>{benefit.subtext}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 p-6 ring-1 ring-primary/10'>
                  <div className='relative z-10'>
                    <div className='flex items-start justify-between gap-4 sm:items-center'>
                      <div className='space-y-2'>
                        <h4 className='font-semibold text-primary'>Comprehensive Coverage</h4>
                        <p className='text-sm text-muted-foreground'>
                          Your membership includes{' '}
                          <span className='font-medium text-foreground'>17 comprehensive benefits</span>, from medical
                          coverage to adventure sports protection.{' '}
                          <span className='hidden sm:inline'>
                            Click &ldquo;View All Benefits&rdquo; for the complete breakdown of your coverage.
                          </span>
                        </p>
                      </div>
                      <ChevronDown
                        className='h-5 w-5 shrink-0 animate-bounce text-primary sm:hidden'
                        aria-hidden='true'
                      />
                    </div>
                  </div>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0)_100%)]' />
                </div>
              </div>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className='space-y-1 px-4 pb-6 sm:px-6'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='w-[40%] bg-muted'>Benefit</TableHead>
                  <TableHead className='w-[40%] bg-muted'>
                    Benefits (Shown as Aggregated Total Per Member Per Membership) Stated In USD
                  </TableHead>
                  <TableHead className='w-[20%] bg-muted'>Excess (If Applicable)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BENEFITS_DATA.map((item, index) => (
                  <TableRow
                    key={index}
                    className={`group transition-colors hover:bg-muted/50 ${
                      item.highlight ? 'bg-primary/5 hover:bg-primary/10' : ''
                    }`}
                  >
                    <TableCell className='whitespace-pre-line align-top font-medium'>{item.benefit}</TableCell>
                    <TableCell className='whitespace-pre-line align-top'>{item.amount}</TableCell>
                    <TableCell className='align-top text-muted-foreground'>{item.excess}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
