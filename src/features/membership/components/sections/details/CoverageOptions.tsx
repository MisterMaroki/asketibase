'use client';

import { Award, Globe, Shield, User, UserPlus, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BASE_PRICES, COVERAGE_DESCRIPTIONS, COVERAGE_TYPES, MEMBERSHIP_TYPES } from '@/constants/membership';
import { getCurrencySymbol } from '@/libs/membership/currency';
import { useMembershipStore } from '@/store/membership-store';

const membershipIcons = {
  INDIVIDUAL: User,
  COUPLE: Users,
  FAMILY: UserPlus,
} as const;

const coverageIcons = {
  WORLDWIDE: Globe,
  PLATINUM: Award,
} as const;

export function CoverageOptions() {
  const { membershipType, coverageType, setMembershipType, setCoverageType, currency } = useMembershipStore();
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <Card className='animate-slide-down'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='h-5 w-5 text-primary' />
          Coverage Options
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <h3 className='text-sm font-medium'>Membership Type</h3>
          <RadioGroup
            value={membershipType || ''}
            onValueChange={(value) => setMembershipType(value as keyof typeof MEMBERSHIP_TYPES)}
            className='grid gap-4 sm:grid-cols-3'
          >
            {Object.entries(MEMBERSHIP_TYPES).map(([key, value]) => {
              const Icon = membershipIcons[key as keyof typeof membershipIcons];
              return (
                <Label
                  key={key}
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
                >
                  <RadioGroupItem value={key} className='sr-only' />
                  <Icon className='mb-3 h-8 w-8 text-muted-foreground [&:has([data-state=checked])]:text-primary' />
                  <span className='text-sm font-medium'>{value}</span>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-medium'>Coverage Type</h3>
          <RadioGroup
            value={coverageType || ''}
            onValueChange={(value) => setCoverageType(value as keyof typeof COVERAGE_TYPES)}
            className='grid gap-4 sm:grid-cols-2'
          >
            {Object.entries(COVERAGE_TYPES).map(([key, value]) => {
              const Icon = coverageIcons[key as keyof typeof coverageIcons];
              return (
                <Label
                  key={key}
                  className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
                >
                  <RadioGroupItem value={key} className='sr-only' />
                  <Icon className='mb-3 h-8 w-8 text-muted-foreground [&:has([data-state=checked])]:text-primary' />
                  <div className='space-y-1.5 text-center'>
                    <span className='text-sm font-medium'>{value}</span>
                    <p className='text-xs text-muted-foreground'>
                      {COVERAGE_DESCRIPTIONS[key as keyof typeof COVERAGE_TYPES]}
                    </p>
                    {membershipType &&
                      BASE_PRICES[key as keyof typeof COVERAGE_TYPES] &&
                      BASE_PRICES[key as keyof typeof COVERAGE_TYPES][membershipType] && (
                        <p className='text-sm font-medium text-primary'>
                          From {currencySymbol}
                          {BASE_PRICES[key as keyof typeof COVERAGE_TYPES][membershipType]}
                        </p>
                      )}
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
