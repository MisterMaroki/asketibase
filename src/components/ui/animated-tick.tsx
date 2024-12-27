'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

import { cn } from '@/utils/cn';

export function AnimatedTick({ className }: { className?: string }) {
  const [showTick, setShowTick] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTick(true);
    }, 500); // Small delay before showing tick

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={cn('relative h-12 w-12', className)}>
      {!showTick ? (
        <div className='absolute inset-0 animate-pulse rounded-full bg-primary/20' />
      ) : (
        <Check className='h-12 w-12 text-primary duration-300 animate-in zoom-in' />
      )}
    </div>
  );
}

export function AnimatedWarning({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-12 w-12', className)}>
      <AlertTriangle className='h-12 w-12 text-primary duration-300 animate-in zoom-in' />
    </div>
  );
}
