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
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/libs/supabase/types';

import { toggleDiscountCode } from '../actions';

interface DiscountCodeActionsProps {
  code: Tables<'fires'>;
}

export function DiscountCodeActions({ code }: DiscountCodeActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const response = await toggleDiscountCode(code.id, !code.active);

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to update discount code');
      }

      toast({
        title: 'Success',
        description: `Discount code ${code.code} ${code.active ? 'deactivated' : 'activated'}`,
      });
    } catch (error) {
      console.error('Error toggling discount code:', error);
      toast({
        title: 'Error',
        description: 'Failed to update discount code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleToggle} disabled={isLoading} className='cursor-pointer'>
          {code.active ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
