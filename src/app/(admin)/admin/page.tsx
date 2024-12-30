import { Suspense } from 'react';
import { Activity, AlertTriangle, FileText, Shield, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from './components/columns';
import { DataTable } from './components/DataTable';
import { MetricCards } from './components/MetricCard';
// import { MetricCard } from './components/MetricCard';

interface DashboardMetrics {
  totalMemberships: number;
  activeMembers: number;
  pendingMemberships: number;
  recentAlerts: number;
}

export default async function AdminPage() {
  async function getGreeting() {
    const user = await getUser();
    const hour = new Date().getHours();

    if (hour < 6) {
      return `Early bird catches the worm, ${user?.first_name}!`;
    } else if (hour < 12) {
      return `Good morning, ${user?.first_name}!`;
    } else if (hour < 18) {
      return `Good afternoon, ${user?.first_name}!`;
    } else if (hour < 20) {
      return `Good evening, ${user?.first_name}!`;
    } else {
      return `Working late, ${user?.first_name}!`;
    }
  }
  const { data: members } = await supabaseAdminClient
    .from('members')
    .select(
      `
    *,
    memberships (
      *,
      quotes (
        *
      )
      )
      `
    )
    .order('created_at', { ascending: false });

  const totalMemberships = members?.length || 0;
  const activeMembers =
    members?.reduce((acc, member) => acc + (member.memberships?.status === 'active' ? 1 : 0), 0) || 0;
  const pendingMemberships = members?.filter((member) => member.memberships?.status === 'draft').length || 0;
  const recentAlerts = 0; // TODO: Implement alerts system

  return (
    <main className='container mx-auto '>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='flex items-center gap-2 text-3xl font-bold'>
          <Shield className='h-8 w-8 text-primary' />
          {getGreeting()}
        </h1>
      </div>

      <Suspense fallback={<LoadingState />}>
        <MetricCards
          totalMemberships={totalMemberships}
          activeMembers={activeMembers}
          pendingMemberships={pendingMemberships}
          recentAlerts={recentAlerts}
        />
      </Suspense>

      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Recent Memberships</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingState />}>
            <DataTable columns={columns} data={members || []} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
