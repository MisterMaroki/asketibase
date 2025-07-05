import { Suspense } from 'react';
import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { getProjectFilterFromParams } from '@/features/admin/get-admin-project-access';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { DataTable } from '../components/DataTable';
import { Member } from '../types';

import { columns } from './components/columns';

export default async function MembersPage({
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

  const members = await supabaseAdminClient
    .from('members')
    .select(
      `
      *,
      memberships (
        id,
        membership_type,
        status,
        coverage_type,
        membership_number
      )
    `,
    )
    .in('membership_id', membershipIdsList)
    .order('created_at', { ascending: false });

  const memberCount = members.data?.length || 0;

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <Users className='h-5 w-5 text-primary' />
        Members
        <Badge variant='secondary' className='ml-2'>
          {memberCount}
        </Badge>
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <DataTable columns={columns as any} data={(members.data as Member[]) || []} from='members' />
      </Suspense>
    </main>
  );
}
