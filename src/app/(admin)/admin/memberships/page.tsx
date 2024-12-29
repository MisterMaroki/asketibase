import { Suspense } from 'react';
import { FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from '../components/columns';
import { DataTable } from '../components/DataTable';

export default async function MembershipsPage() {
  const memberships = await supabaseAdminClient
    .from('memberships')
    .select(
      `
            *,
            members (
              id,
              first_name,
              last_name,
              email
            ),
            users (
              email
            )
          `
    )
    .order('created_at', { ascending: false });

  return (
    <main className='container mx-auto '>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <FileText className='h-5 w-5 text-primary' />
        Memberships
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <DataTable columns={columns} data={memberships.data || []} />
      </Suspense>
    </main>
  );
}
