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
      <DetailsPanel type='quotes' id={quote.id} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
