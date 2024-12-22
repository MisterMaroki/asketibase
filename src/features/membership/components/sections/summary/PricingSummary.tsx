'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';

interface PricingSummaryProps {
  quote: {
    currency: string;
    member_prices: Array<{
      memberId: string;
      countryPrice: number;
      ageFactor: number;
      coverageFactor: number;
      medicalFactor: number;
      dailyTotal: number;
      total: number;
    }>;
    base_price: number;
    coverage_loading_price: number;
    medical_loading_price: number;
    total_price: number;
    discount_amount: number;
  };
}

export function PricingSummary({ quote }: PricingSummaryProps) {
  return (
    <div className='space-y-6'>
      <Card className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Quote Summary</h3>

        <div className='space-y-4'>
          {/* Base Pricing */}
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Base Price</span>
            <span className='font-medium'>{formatCurrency(quote.base_price, quote.currency)}</span>
          </div>

          {/* Coverage Loading */}
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Coverage Loading</span>
            <span className='font-medium'>{formatCurrency(quote.coverage_loading_price, quote.currency)}</span>
          </div>

          {/* Medical Loading */}
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Medical Loading</span>
            <span className='font-medium'>{formatCurrency(quote.medical_loading_price, quote.currency)}</span>
          </div>

          {/* Discount if applicable */}
          {quote.discount_amount > 0 && (
            <div className='flex items-center justify-between text-green-600'>
              <span>Discount</span>
              <span>-{formatCurrency(quote.discount_amount, quote.currency)}</span>
            </div>
          )}

          {/* Total */}
          <div className='border-t pt-4'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>Total</span>
              <span className='text-lg font-semibold'>{formatCurrency(quote.total_price, quote.currency)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Member Breakdown */}
      <Card className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>Member Breakdown</h3>
        <div className='space-y-6'>
          {quote.member_prices.map((member, index) => (
            <div key={member.memberId} className={index > 0 ? 'border-t pt-4' : ''}>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Country Base Price</span>
                  <span>{formatCurrency(member.countryPrice, quote.currency)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Age Loading</span>
                  <span>{formatCurrency(member.ageFactor, quote.currency)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Coverage Loading</span>
                  <span>{formatCurrency(member.coverageFactor, quote.currency)}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Medical Loading</span>
                  <span>{formatCurrency(member.medicalFactor, quote.currency)}</span>
                </div>
                <div className='flex items-center justify-between pt-2 font-medium'>
                  <span>Daily Total</span>
                  <span>{formatCurrency(member.dailyTotal, quote.currency)}</span>
                </div>
                <div className='flex items-center justify-between font-semibold'>
                  <span>Member Total</span>
                  <span>{formatCurrency(member.total, quote.currency)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
