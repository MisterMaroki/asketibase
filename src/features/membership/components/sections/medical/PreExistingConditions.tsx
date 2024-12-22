'use client';

import { User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface PreExistingConditionsProps {
  memberId: string;
  memberName: string;
  hasConditions: boolean | null;
  onAnswer: (memberId: string, hasConditions: boolean) => void;
}

export function PreExistingConditions({ memberId, memberName, hasConditions, onAnswer }: PreExistingConditionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5 text-primary' />
          {memberName}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Do you have any pre-existing medical conditions as defined above?
        </p>
        <div className='flex gap-4'>
          <Button
            type='button'
            variant='outline'
            className={cn(
              'flex-1',
              hasConditions === true && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            )}
            onClick={() => onAnswer(memberId, true)}
          >
            Yes
          </Button>
          <Button
            type='button'
            variant='outline'
            className={cn(
              'flex-1',
              hasConditions === false && 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
            onClick={() => onAnswer(memberId, false)}
          >
            No
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
