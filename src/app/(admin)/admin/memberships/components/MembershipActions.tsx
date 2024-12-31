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

type Member = Pick<
  Tables<'members'>,
  'id' | 'first_name' | 'last_name' | 'email' | 'contact_number' | 'date_of_birth' | 'nationality' | 'is_primary'
>;

type Quote = Pick<
  Tables<'quotes'>,
  | 'id'
  | 'created_at'
  | 'base_price'
  | 'tax_amount'
  | 'total_price_with_tax'
  | 'currency'
  | 'coverage_loading_price'
  | 'discount_amount'
  | 'gbp_total'
  | 'medical_loading_price'
  | 'member_prices'
  | 'total_price'
>;

type Membership = Tables<'memberships'> & {
  quotes: Quote[];
  members: Member[];
  users: {
    email: string;
  } | null;
};

interface MembershipActionsProps {
  membership: Membership;
}

export function MembershipActions({ membership }: MembershipActionsProps) {
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

      <DetailsPanel type='memberships' id={membership.id} open={open} onOpenChange={setOpen} />
    </>
  );
}
