import { Suspense } from 'react';
import { Coins } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/features/membership/components/LoadingState';

import { getAgeFactors } from './age-factors/actions';
import { AgeFactorsTable } from './age-factors/components/AgeFactorsTable';
import { CountryBasePricesTable } from './country-prices/components/CountryBasePricesTable';
import { getCoverageFactors } from './coverage-factors/actions';
import { CoverageFactorsTable } from './coverage-factors/components/CoverageFactorsTable';
import { getMedicalRiskFactors } from './medical-risk/actions';
import { MedicalRiskFactorsTable } from './medical-risk/components/MedicalRiskFactorsTable';
import { getCountryBasePrices } from './actions';

export default async function PricingPage() {
  const [prices, medicalRiskFactors, ageFactors, coverageFactors] = await Promise.all([
    getCountryBasePrices(),
    getMedicalRiskFactors(),
    getAgeFactors(),
    getCoverageFactors(),
  ]);

  const countryPricesCount = prices?.length || 0;
  const medicalRiskCount = medicalRiskFactors?.length || 0;
  const ageFactorsCount = ageFactors?.length || 0;
  const coverageFactorsCount = coverageFactors?.length || 0;

  return (
    <main className='container mx-auto px-2 py-4 sm:px-4 sm:py-6'>
      <CardTitle className='mb-6 flex items-center gap-2'>
        <Coins className='h-5 w-5 text-primary' />
        Pricing Management
      </CardTitle>
      <Tabs defaultValue='country-prices'>
        <div className='relative w-full md:w-fit'>
          <TabsList className='flex w-full overflow-x-auto whitespace-nowrap'>
            <TabsTrigger value='country-prices' className='flex items-center gap-2'>
              Countries
              <Badge variant='outline' className='h-5 text-xs'>
                {countryPricesCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='medical-risk' className='flex items-center gap-2'>
              Medical
              <Badge variant='outline' className='h-5 text-xs'>
                {medicalRiskCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='age-factors' className='flex items-center gap-2'>
              Age
              <Badge variant='outline' className='h-5 text-xs'>
                {ageFactorsCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value='location-factors' className='flex items-center gap-2'>
              Location
              <Badge variant='outline' className='h-5 text-xs'>
                {coverageFactorsCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
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
        <TabsContent value='location-factors'>
          <Suspense fallback={<LoadingState />}>
            <CoverageFactorsTable data={coverageFactors} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}
