'use client';

import { Button } from '@/components/ui/button';
import { useMembershipStore } from '@/store/membership-store';

export function ResetButton({ className }: { className?: string }) {
  const reset = useMembershipStore((state) => state.reset);

  return (
    <Button onClick={reset} className={className}>
      (DEV)Reset Form
    </Button>
  );
}
