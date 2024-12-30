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

    const variants = {
      1: { variant: 'default' as const, label: '' },
      0: { variant: 'secondary' as const, label: '' },
    };

    const { variant, label } = variants[riskLevel as keyof typeof variants];
    return (
      <Badge variant={variant} className='font-normal'>
        {label}
      </Badge>
    );
  };

  return (
    <Collapsible className='w-full' defaultOpen={isPrimary}>
      <CollapsibleTrigger asChild>
        <Button variant='ghost' className='flex w-full items-center justify-between p-4 hover:bg-muted/50'>
          <div className='flex flex-1 items-center gap-2 overflow-hidden'>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
              {getRiskLevelBadge()}
              <span className='truncate font-medium'>
                {member.salutation} {member.firstName} {member.lastName}
              </span>
            </div>
            <div className='flex shrink-0 gap-2'>
              {isPrimary && (
                <Badge variant='secondary' className='font-normal'>
                  Primary
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-3 p-4 pt-2 text-sm'>
        <div className='grid gap-2 text-muted-foreground'>
          <div className='grid grid-cols-2 gap-1'>
            <span className='font-medium'>Full Name:</span>
            <span>
              {member.salutation} {member.firstName} {member.lastName}
            </span>
          </div>
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
