import { Suspense } from 'react';
import { HeartPulse } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';

import { MedicalRiskFactorsTable } from './components/MedicalRiskFactorsTable';
import { getMedicalRiskFactors } from './actions';

export default async function MedicalRiskPricingPage() {
  const riskFactors = await getMedicalRiskFactors();

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <HeartPulse className='h-5 w-5 text-primary' />
        Medical Risk Factor Prices
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <MedicalRiskFactorsTable data={riskFactors} />
      </Suspense>
    </main>
  );
}
