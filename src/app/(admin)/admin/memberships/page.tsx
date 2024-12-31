import { Suspense } from 'react';
import { FileText } from 'lucide-react';

import { CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Tables } from '@/libs/supabase/types';

import { DataTable } from '../components/DataTable';

import { columns } from './components/columns';

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

export default async function MembershipsPage() {
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
    .order('created_at', { ascending: false });

  return (
    <main className='container mx-auto'>
      <CardTitle className='mb-4 flex items-center gap-2'>
        <FileText className='h-5 w-5 text-primary' />
        Memberships
      </CardTitle>
      <Suspense fallback={<LoadingState />}>
        <DataTable columns={columns} data={(memberships.data as Membership[]) || []} from='memberships' />
      </Suspense>
    </main>
  );
}
