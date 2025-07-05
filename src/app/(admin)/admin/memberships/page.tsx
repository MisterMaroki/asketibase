import { Suspense } from 'react';
import { FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { getProjectFilterFromParams } from '@/features/admin/get-admin-project-access';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Tables } from '@/libs/supabase/types';

import { MembershipsDataTable } from './components/MembershipsDataTable';

type Member = Pick<
  Tables<'members'>,
  'id' | 'first_name' | 'last_name' | 'email' | 'contact_number' | 'date_of_birth' | 'nationality' | 'is_primary'
>;

type Quote = Pick<
  Tables<'quotes'>,
  | 'id'
  | 'created_at'
  | 'base_price'
  | 'tax_amount'
  | 'total_price_with_tax'
  | 'currency'
  | 'coverage_loading_price'
  | 'discount_amount'
  | 'gbp_total'
  | 'medical_loading_price'
  | 'member_prices'
  | 'total_price'
>;

type Membership = Tables<'memberships'> & {
  quotes: Quote[];
  members: Member[];
  users: {
    email: string;
  } | null;
};

export default async function MembershipsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get project filter from URL params
  const projectFilter = await getProjectFilterFromParams(searchParams);

  const memberships = await supabaseAdminClient
    .from('memberships')
    .select(
      `
      *,
      quotes (
        id,
        created_at,
        base_price,
        tax_amount,
        total_price_with_tax,
        currency,
        coverage_loading_price,
        discount_amount,
        gbp_total,
        medical_loading_price,
        member_prices,
        total_price
      ),
      members (
        id,
        first_name,
        last_name,
        email,
        contact_number,
        date_of_birth,
        nationality,
        is_primary
      ),
      users (
        email
      )
    `,
    )
    .not('status', 'eq', 'draft')
    .in('project_code', projectFilter)
    .order('created_at', { ascending: false });

  const membershipCount = memberships.data?.length || 0;

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <FileText className='h-5 w-5 text-primary' />
        Memberships
        <Badge variant='secondary' className='ml-2'>
          {membershipCount}
        </Badge>
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <MembershipsDataTable data={(memberships.data as Membership[]) || []} />
      </Suspense>
    </main>
  );
}
