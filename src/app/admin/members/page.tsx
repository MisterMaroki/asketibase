import { Suspense } from 'react';
import { Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from './components/columns';
import { DataTable } from './components/DataTable';

export default async function MembersPage() {
  const members = await supabaseAdminClient
    .from('members')
    .select(
      `
    *,
    memberships (
      membership_type,
      coverage_type,
      status
      )
      `
    )
    .order('created_at', { ascending: false });

  return (
    <main className='container mx-auto '>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState />}>
            <DataTable columns={columns} data={members.data || []} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
