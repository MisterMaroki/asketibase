import { Suspense } from 'react';
import { Users } from 'lucide-react';

import { CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { DataTable } from '../components/DataTable';

import { columns } from './components/columns';

export default async function MembersPage() {
  const members = await supabaseAdminClient
    .from('members')
    .select(
      `
      *,
      memberships (
        id,
        membership_type,
        coverage_type,
        status,
        quotes (
          *
        )
      )
    `,
    )
    .order('created_at', { ascending: false });

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <Users className='h-5 w-5 text-primary' />
        Members
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <DataTable columns={columns} data={members.data || []} from='members' />
      </Suspense>
    </main>
  );
}
