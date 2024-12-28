import { Suspense } from 'react';
import { Coins } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';

import { CountryBasePricesTable } from './components/CountryBasePricesTable';
import { getCountryBasePrices } from './actions';

export default async function PricingPage() {
  const prices = await getCountryBasePrices();

  return (
    <main className='container mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Coins className='h-5 w-5 text-primary' />
            Country Base Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState />}>
            <CountryBasePricesTable data={prices} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
