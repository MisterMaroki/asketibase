import { Suspense } from 'react';
import { FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from '../components/columns';
import { DataTable } from '../components/DataTable';

export default async function ApplicationsPage() {
  const applications = await supabaseAdminClient
    .from('applications')
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
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5 text-primary' />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState />}>
            <DataTable columns={columns} data={applications.data || []} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
