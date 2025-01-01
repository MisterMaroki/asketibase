'use client';

import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Member } from '@/store/membership-store';
import { useMembershipStore } from '@/store/membership-store';

interface MemberSummaryProps {
  member: Member;
  isPrimary: boolean;
  isComplete: boolean;
}

export function MemberSummary({ member, isPrimary, isComplete }: MemberSummaryProps) {
  const { medicalState } = useMembershipStore();
  const riskLevel = medicalState.completedMembers[member.id];

  const getRiskLevelBadge = () => {
    if (riskLevel === undefined) return null;

    return (
      <Badge variant={riskLevel === 1 ? 'default' : 'secondary'} className='font-normal'>
        {''}
      </Badge>
    );
  };

  return (
    <Collapsible className='w-full' defaultOpen={isPrimary}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='flex w-full items-center justify-between p-3 hover:bg-muted/50 sm:p-5'>
          <div className='flex flex-1 items-center gap-2 overflow-hidden sm:gap-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2 sm:gap-3'>
              {getRiskLevelBadge()}
              <span className='truncate font-medium'>
                {member.salutation} {member.firstName} {member.lastName}
              </span>
            </div>
            <div className='flex shrink-0 gap-2 sm:gap-3'>
              {isPrimary && (
                <Badge variant='secondary' className='text-xs font-normal sm:text-sm'>
                  Primary
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 sm:ml-3' />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-3 p-3 pt-2 text-xs sm:space-y-4 sm:p-5 sm:pt-3 sm:text-sm'>
        <div className='grid gap-3 text-muted-foreground sm:gap-4'>
          <div className='grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-2 sm:gap-3'>
            <span className='font-medium'>Full Name:</span>
            <span className='break-words'>
              {member.salutation} {member.firstName} {member.lastName}
            </span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-2 sm:gap-3'>
            <span className='font-medium'>Date of Birth:</span>
            <span>{format(member.dateOfBirth!, 'PPP')}</span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-2 sm:gap-3'>
            <span className='font-medium'>Gender:</span>
            <span className='capitalize'>{member.gender}</span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-2 sm:gap-3'>
            <span className='font-medium'>Email:</span>
            <span className='break-all'>{member.email}</span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-2 sm:gap-3'>
            <span className='font-medium'>Contact:</span>
            <span className='break-words'>
              {member.countryCode} {member.contactNumber}
            </span>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-2 sm:gap-3'>
            <span className='font-medium'>Address:</span>
            <span className='break-words'>{member.address}</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
