import { Suspense } from 'react';
import { Receipt } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { createClient } from '@/libs/supabase/client';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from './components/columns';
import { DataTable } from './components/DataTable';

export default async function QuotesPage() {
  const { data } = await supabaseAdminClient
    .from('quotes')
    .select(
      `
            *
          `
    )
    .order('created_at', { ascending: false });
  return (
    <main className='container mx-auto '>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Receipt className='h-5 w-5 text-primary' />
            Quotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState />}>
            <DataTable columns={columns} data={data || []} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
