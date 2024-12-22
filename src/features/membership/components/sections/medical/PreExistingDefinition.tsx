'use client';

import { AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PreExistingDefinition() {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <AlertCircle className='h-5 w-5 text-primary' />
          Pre-Existing Medical Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <p className='text-sm font-medium text-muted-foreground'>
            A Pre-Existing Medical Condition means any of the following:
          </p>
          <div className='rounded-lg bg-muted/50 p-6'>
            <ol className='list-decimal space-y-4 pl-4 text-sm'>
              <li>
                <span className='text-foreground'>
                  Any respiratory condition (relating to the lungs or breathing), heart condition, stroke, Crohn&apos;s
                  disease, epilepsy or cancer for which you have ever received treatment
                </span>
                <p className='mt-1 text-xs text-muted-foreground'>
                  Including surgery, tests or investigations by your doctor or a consultant/specialist and prescribed
                  drugs or medication
                </p>
              </li>
              <li>
                <span className='text-foreground'>
                  Any medical condition for which you have received surgery, in-patient treatment or investigations in a
                  hospital or clinic within the last twelve months
                </span>
              </li>
              <li>
                <span className='text-foreground'>
                  Any medical condition for which you are taking prescribed drugs or medication
                </span>
              </li>
              <li>
                <span className='text-foreground'>
                  Any medical condition for which you have received a terminal prognosis
                </span>
              </li>
              <li>
                <span className='text-foreground'>
                  Any medical condition that you are aware of but for which you have not had a diagnosis
                </span>
              </li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
