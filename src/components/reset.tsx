'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useMembershipStore } from '@/store/membership-store';

export function ResetButton({ className }: { className?: string }) {
  const reset = useMembershipStore((state) => state.reset);
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        reset();
        router.push('/?step=1');
      }}
      className={className}
    >
      (DEV)Reset Form
    </Button>
  );
}
