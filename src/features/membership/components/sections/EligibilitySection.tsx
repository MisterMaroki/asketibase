import { useEffect } from 'react';

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
    <div className='space-y-6'>
      <div className='px-1 pb-2 pt-4'>
        <CardTitle className='flex items-center gap-2 px-0 text-xl'>
          <svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            className='scale-110 text-primary'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M-.725 11.18A11.198 11.198 0 1111.15-1.462'
              strokeLinecap='round'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinejoin='round'
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(-.05 -.01)'
            />
            <path
              d='M.213 5.502L1.21.475h1.075a1.472 1.472 0 001.174-.578 1.434 1.434 0 00.27-1.274L2.98-4.363a1.483 1.483 0 00-1.444-1.135h-5.305'
              strokeLinecap='round'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinejoin='round'
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(-7.18 3.26)'
            />
            <path
              d='M3.13-2.057H-.931A1.483 1.483 0 00-2.375-.923l-.746 2.987'
              strokeLinecap='round'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinejoin='round'
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(5.83 -4.66)'
            />
            <path
              d='M3.484-3.736h-6.968a.995.995 0 00-.995.996v5.475c0 .55.446.995.995.995h6.968c.55 0 .996-.446.996-.995V-2.74a.995.995 0 00-.996-.996z'
              strokeLinecap='round'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinejoin='round'
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(6.72 7.47)'
            />
            <path
              d='M0-2.235A2.986 2.986 0 00-2.986.751v1.494h5.973V.75A2.986 2.986 0 000-2.235z'
              strokeLinecap='round'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinejoin='round'
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(6.72 1.49)'
            />
            <path
              d='M.185.376a.373.373 0 010-.747'
              stroke='currentColor'
              strokeWidth={2}
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(6.54 7.49)'
            />
            <path
              d='M-.185.376a.373.373 0 000-.747'
              stroke='currentColor'
              strokeWidth={2}
              fill='none'
              transform='matrix(.83 0 0 .83 12 12) translate(6.91 7.49)'
            />
          </svg>
          Global Travel Protection
        </CardTitle>
        <p className='mt-2 text-muted-foreground'>Let&apos;s ensure you get the right coverage for your journey.</p>
      </div>
      <div className='mt-2 grid gap-6 md:grid-cols-2'>
        <EligibilityList />
        <EligibilityConfirmation hideOn='md' />
      </div>
    </div>
  );
}
