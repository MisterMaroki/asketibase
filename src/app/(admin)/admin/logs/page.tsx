import { Suspense } from 'react';
import { ScrollText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { LogsTable } from '../components/LogsTable';

export default async function LogsPage() {
  const { data: logs } = await supabaseAdminClient.from('logs').select('*').order('timestamp', { ascending: false });

  const logCount = logs?.length || 0;

  return (
    <main className='container space-y-4 px-4 pb-4 sm:space-y-6 sm:px-6 sm:pb-6'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-2xl font-bold sm:text-3xl'>
          <ScrollText className='h-6 w-6 text-primary sm:h-8 sm:w-8' />
          System Logs
          <Badge variant='secondary' className='ml-2'>
            {logCount}
          </Badge>
        </h2>
      </div>

      <Suspense fallback={<LoadingState />}>
        <LogsTable data={logs || ([] as any)} />
      </Suspense>
    </main>
  );
}
