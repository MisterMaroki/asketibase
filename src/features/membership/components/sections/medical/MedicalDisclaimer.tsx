'use client';

import { AlertTriangle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MedicalDisclaimer() {
  return (
    <Card className='border-destructive/50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <AlertTriangle className='h-5 w-5 text-destructive' />
          Medical Declaration
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-6'>
          <div className='space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4'>
            <h3 className='flex items-center gap-2 font-medium text-destructive'>
              <AlertTriangle className='h-4 w-4' />
              Important Notice
            </h3>
            <p className='text-sm leading-relaxed'>
              The Medical Screening should be completed honestly. Any dishonest, false or misleading answers will result
              in any claims being declined and Membership cancelled. It is important you take time to answer these
              questions carefully.
            </p>
            <p className='text-sm leading-relaxed'>
              This Membership will not cover claims relating to a Pre-Existing Medical Condition unless you comply with
              the following Declaration.
            </p>
          </div>

          <div className='space-y-4'>
            <h3 className='text-base font-medium'>Coverage Exclusions</h3>
            <div className='space-y-3 text-sm'>
              <p className='font-medium text-muted-foreground'>
                You will not be covered for any claims arising directly or indirectly from:
              </p>
              <ol className='list-decimal space-y-3 pl-4 text-muted-foreground'>
                <li>Any medical condition where you are travelling against medical advice</li>
                <li>
                  Any medical condition for which you are travelling specifically to obtain and/or receive treatment
                </li>
                <li>
                  Travel against World Health Organisation (WHO) advice, home government body, or that of the carrier,
                  their handling agent or any other public transport provider
                </li>
                <li>
                  Any medical condition for which you are not taking the recommended treatment or prescribed medication
                </li>
              </ol>
            </div>
          </div>

          <div className='space-y-3 rounded-lg bg-muted/50 p-4'>
            <h3 className='text-base font-medium'>Changes to Health Status</h3>
            <p className='text-sm text-muted-foreground'>
              Please be aware that you must tell us about any new diagnosed medical conditions or changes to your
              existing medical conditions that take place between the date you bought your policy and either the date
              you booked your trip or before you travel. Please see the details in your membership policy wording.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
