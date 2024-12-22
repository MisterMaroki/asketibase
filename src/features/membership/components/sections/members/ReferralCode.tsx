'use client';

import { Ticket } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMembershipStore } from '@/store/membership-store';

export function ReferralCode() {
  const { referralCode, setReferralCode } = useMembershipStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" />
          Referral Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            placeholder="Enter referral code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            If you have a referral code, enter it here to receive any applicable discounts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}