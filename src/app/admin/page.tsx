import { Suspense } from 'react';
import { Activity, AlertTriangle, FileText, Shield, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from './components/columns';
import { DataTable } from './components/DataTable';
import { MetricCards } from './components/MetricCard';
// import { MetricCard } from './components/MetricCard';

interface DashboardMetrics {
  totalApplications: number;
  activeMembers: number;
  pendingApplications: number;
  recentAlerts: number;
}

export default async function AdminPage() {
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

  const totalApplications = members?.length || 0;
  const activeMembers =
    members?.reduce((acc, member) => acc + (member.memberships?.status === 'active' ? 1 : 0), 0) || 0;
  const pendingApplications = members?.filter((member) => member.memberships?.status === 'draft').length || 0;
  const recentAlerts = 0; // TODO: Implement alerts system

  return (
    <main className='container mx-auto '>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='flex items-center gap-2 text-3xl font-bold'>
          <Shield className='h-8 w-8 text-primary' />
          Admin Dashboard
        </h1>
      </div>

      <Suspense fallback={<LoadingState />}>
        {/* <div className='mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Total Applications'
            value={totalApplications}
            icon={FileText}
            description='Total memberships submitted'
          />
          <MetricCard
            title='Active Members'
            value={activeMembers}
            icon={Users}
            description='Total members across all memberships'
          />
          <MetricCard
            title='Pending Applications'
            value={pendingApplications}
            icon={Activity}
            description=Memberships awaiting review'
          />
          <MetricCard
            title='Recent Alerts'
            value={recentAlerts}
            icon={AlertTriangle}
            description='Alerts in the last 24 hours'
          />
        </div> */}
        <MetricCards
          totalApplications={totalApplications}
          activeMembers={activeMembers}
          pendingApplications={pendingApplications}
          recentAlerts={recentAlerts}
        />
      </Suspense>

      <Card className='mt-8'>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
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
