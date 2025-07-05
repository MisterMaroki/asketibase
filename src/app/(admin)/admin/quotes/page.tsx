import { Suspense } from 'react';
import { Receipt } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { getProjectFilterFromParams } from '@/features/admin/get-admin-project-access';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { DataTable } from '../components/DataTable';
import { Membership, Quote } from '../types';

import { columns } from './components/columns';

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get project filter from URL params
  const projectFilter = await getProjectFilterFromParams(searchParams);

  // Get membership IDs for the project filter
  const { data: membershipIds } = await supabaseAdminClient
    .from('memberships')
    .select('id')
    .in('project_code', projectFilter);

  const membershipIdsList = membershipIds?.map((m) => m.id) || [];

  const quotes = await supabaseAdminClient
    .from('quotes')
    .select(
      `
      *,
      memberships (
        *,
        members (
          *
        )
      )
    `,
    )
    .in('membership_id', membershipIdsList)
    .order('created_at', { ascending: false });

  const quoteCount = quotes.data?.length || 0;

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <Receipt className='h-5 w-5 text-primary' />
        Quotes
        <Badge variant='secondary' className='ml-2'>
          {quoteCount}
        </Badge>
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <DataTable
          columns={columns as any}
          data={(quotes.data as (Quote & { memberships: Membership })[]) || []}
          from='quotes'
        />
      </Suspense>
    </main>
  );
}
