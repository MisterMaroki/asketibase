'use client';

import { Globe2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCIES } from '@/constants/options';
import { useMembershipStore } from '@/store/membership-store';

export function CurrencySection() {
  const { currency, setCurrency } = useMembershipStore();

  return (
    <Card className='animate-slide-down'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Globe2 className='h-5 w-5 text-primary' />
          Preferred Currency
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Currency</label>
          <Select value={currency || ''} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder='Select currency' />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
