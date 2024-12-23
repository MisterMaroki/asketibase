import { Coins } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CountryBasePricesTable } from './components/CountryBasePricesTable';

export default function PricingPage() {
  return (
    <main className='container mx-auto '>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Coins className='h-5 w-5 text-primary' />
            Country Base Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CountryBasePricesTable />
        </CardContent>
      </Card>
    </main>
  );
}
