import { Suspense } from 'react';
import { Coins } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/features/membership/components/LoadingState';

import { getAgeFactors } from './age-factors/actions';
import { AgeFactorsTable } from './age-factors/components/AgeFactorsTable';
import { CountryBasePricesTable } from './components/CountryBasePricesTable';
import { getMedicalRiskFactors } from './medical-risk/actions';
import { MedicalRiskFactorsTable } from './medical-risk/components/MedicalRiskFactorsTable';
import { getCountryBasePrices } from './actions';

export default async function PricingPage() {
  const [prices, medicalRiskFactors, ageFactors] = await Promise.all([
    getCountryBasePrices(),
    getMedicalRiskFactors(),
    getAgeFactors(),
  ]);

  return (
    <main className='container mx-auto px-2 py-4 sm:px-4 sm:py-6'>
      <CardTitle className='mb-6 flex items-center gap-2'>
        <Coins className='h-5 w-5 text-primary' />
        Pricing Management
      </CardTitle>
      <Tabs defaultValue='country-prices'>
        <TabsList className=''>
          <TabsTrigger value='country-prices'>Country Prices</TabsTrigger>
          <TabsTrigger value='medical-risk'>Medical Factors</TabsTrigger>
          <TabsTrigger value='age-factors'>Age Factors</TabsTrigger>
        </TabsList>
        <TabsContent value='country-prices'>
          <Suspense fallback={<LoadingState />}>
            <CountryBasePricesTable data={prices} />
          </Suspense>
        </TabsContent>
        <TabsContent value='medical-risk'>
          <Suspense fallback={<LoadingState />}>
            <MedicalRiskFactorsTable data={medicalRiskFactors} />
          </Suspense>
        </TabsContent>
        <TabsContent value='age-factors'>
          <Suspense fallback={<LoadingState />}>
            <AgeFactorsTable data={ageFactors} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}
