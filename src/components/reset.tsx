'use client';

import { Button } from '@/components/ui/button';
import { useMembershipStore } from '@/store/membership-store';

export function ResetButton() {
  const reset = useMembershipStore((state) => state.reset);

  return <Button onClick={reset}>Reset</Button>;
}
