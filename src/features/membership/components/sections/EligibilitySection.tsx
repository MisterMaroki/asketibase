import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { logOperation } from '../../actions/log-action';

import { EligibilityConfirmation } from './eligibility/EligibilityConfirmation';
import { EligibilityList } from './eligibility/EligibilityList';

export function EligibilitySection() {
  useEffect(() => {
    logOperation({
      level: 'info',
      operation: 'view_eligibility',
      details: {
        timestamp: new Date().toISOString(),
        page: 'membership',
        section: 'eligibility',
      },
    });
  }, []);

  return (
    <Card className='border-0 bg-transparent backdrop-blur-sm md:bg-background/50 '>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-xl'>
          <AlertCircle className='h-5 w-5 text-primary' />
          Membership Eligibility
        </CardTitle>
      </CardHeader>
      <CardContent className='mt-2 grid gap-8 md:grid-cols-2'>
        <EligibilityList />
        <EligibilityConfirmation hideOn='md' />
      </CardContent>
    </Card>
  );
}
