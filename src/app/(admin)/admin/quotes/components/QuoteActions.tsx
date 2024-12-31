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

import { DetailsPanel } from '../../components/DetailsPanel';
import { Quote } from '../../types';

interface QuoteActionsProps {
  quote: Quote;
}

export function QuoteActions({ quote }: QuoteActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailsPanel type='quotes' id={quote.id} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
