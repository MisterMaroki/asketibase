'use client';

import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Member } from '@/store/membership-store';

interface MemberSummaryProps {
  member: Member;
  isPrimary: boolean;
  isComplete: boolean;
}

export function MemberSummary({ member, isPrimary, isComplete }: MemberSummaryProps) {
  return (
    <Collapsible className='w-full' defaultOpen={isPrimary}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='flex w-full items-center justify-between p-4 hover:bg-muted/50'>
          <div className='flex items-center gap-2'>
            <span className='font-medium'>
              {member.salutation} {member.firstName} {member.lastName}
            </span>
            {isPrimary && (
              <Badge variant='secondary' className='font-normal '>
                Primary Member
              </Badge>
            )}
            {isComplete && (
              <Badge variant='outline' className='font-normal'>
                Medical Complete
              </Badge>
            )}
          </div>
          <ChevronDown className='h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-3 p-4 pt-2 text-sm'>
        <div className='grid gap-2 text-muted-foreground'>
          <div className='grid grid-cols-2 gap-1'>
            <span className='font-medium'>Date of Birth:</span>
            <span>{format(member.dateOfBirth!, 'PPP')}</span>
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <span className='font-medium'>Gender:</span>
            <span className='capitalize'>{member.gender}</span>
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <span className='font-medium'>Email:</span>
            <span>{member.email}</span>
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <span className='font-medium'>Contact:</span>
            <span>
              {member.countryCode} {member.contactNumber}
            </span>
          </div>
          <div className='grid grid-cols-2 gap-1'>
            <span className='font-medium'>Address:</span>
            <span className='break-words'>{member.address}</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
