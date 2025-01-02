import { Suspense } from 'react';
import { Receipt } from 'lucide-react';

import { CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { DataTable } from '../components/DataTable';
import { Quote } from '../types';

import { columns } from './components/columns';

export default async function QuotesPage() {
  const quotes = await supabaseAdminClient
    .from('quotes')
    .select(
      `
      *,
      memberships (
        id,
        membership_type,
        coverage_type,
        status,
        members (
          id,
          first_name,
          last_name,
          email,
          contact_number,
          date_of_birth,
          nationality,
          is_primary
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <Receipt className='h-5 w-5 text-primary' />
        Quotes
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <DataTable columns={columns as any} data={quotes.data as Quote[]} from='quotes' />
      </Suspense>
    </main>
  );
}
