import { Suspense } from 'react';
import { Percent } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { CreateDiscountCode } from './components/CreateDiscountCode';
import { DiscountCodesTable } from './components/DiscountCodesTable';

export default async function DiscountCodesPage() {
  const { data: discountCodes } = await supabaseAdminClient
    .from('fires')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className='container mx-auto'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='flex items-center gap-2 text-3xl font-bold'>
          <Percent className='h-8 w-8 text-primary' />
          Discount Codes
        </h1>
        <CreateDiscountCode />
      </div>

      <Suspense fallback={<LoadingState />}>
        <DiscountCodesTable data={discountCodes || []} />
      </Suspense>
    </main>
  );
}
