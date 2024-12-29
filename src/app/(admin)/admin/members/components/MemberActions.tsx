'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tables } from '@/libs/supabase/types';

import { DetailsPanel } from '../../components/DetailsPanel';

interface MemberActionsProps {
  member: Tables<'members'>;
}

export function MemberActions({ member }: MemberActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setOpen(true)}>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailsPanel type='member' id={member.id} open={open} onOpenChange={setOpen} />
    </>
  );
}
