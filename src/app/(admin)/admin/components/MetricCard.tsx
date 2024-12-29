'use client';

import { Activity, AlertTriangle, FileText, Icon, LucideIcon, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
}

export function MetricCard({ title, value, icon: Icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
          <Icon className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='space-y-1'>
          <p className='text-2xl font-bold'>{value.toLocaleString()}</p>
          <p className='text-xs text-muted-foreground'>{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
export function MetricCards({
  totalMemberships,
  activeMembers,
  pendingMemberships,
  recentAlerts,
}: {
  totalMemberships: number;
  activeMembers: number;
  pendingMemberships: number;
  recentAlerts: number;
}) {
  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <MetricCard
        title='Total Memberships'
        value={totalMemberships}
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
        title='Pending Memberships'
        value={pendingMemberships}
        icon={Activity}
        description='Memberships awaiting review'
      />
      <MetricCard
        title='Recent Alerts'
        value={recentAlerts}
        icon={AlertTriangle}
        description='Alerts in the last 24 hours'
      />
    </div>
  );
}
