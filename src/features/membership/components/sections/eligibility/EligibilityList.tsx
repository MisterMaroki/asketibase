'use client';

import { Check } from 'lucide-react';

import { ELIGIBILITY_REQUIREMENTS, ELIGIBILITY_STATEMENT } from '@/libs/membership/eligibility';

export function EligibilityList() {
  return (
    <>
     <div className='overflow-hidden rounded-lg'>
        <div className='border-b border-border/50 bg-secondary/10 px-6 py-3'>
          <h3 className='font-medium'>Statement</h3>
        </div>
        <div className='bg-secondary/5 p-6'>
          <p className='text-sm leading-relaxed text-secondary-foreground'>{ELIGIBILITY_STATEMENT}</p>
        </div>
     </div>

<div className='overflow-hidden rounded-lg'>
      <div className='border-b border-border/50 bg-secondary/10 px-6 py-3'>
        <h3 className='font-medium'>Requirements</h3>
      </div>
      <div className='bg-secondary/5 p-6'>
        <ul className='space-y-4'>
          {ELIGIBILITY_REQUIREMENTS.map((requirement, index) => (
            <li
            key={index}
            className='group flex items-start gap-3'
            style={{
              animation: `slideDown 0.3s ease-out ${index * 0.1}s`,
              opacity: 0,
              animationFillMode: 'forwards',
            }}
            >
              <div className='rounded-full bg-primary/10 p-1 transition-colors group-hover:bg-primary/20'>
                <Check className='h-4 w-4 text-primary' />
              </div>
              <span className='flex-1 text-sm leading-relaxed text-secondary-foreground'>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
  );
}
