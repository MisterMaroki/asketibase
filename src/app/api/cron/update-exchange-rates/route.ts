'use server';
import { NextResponse } from 'next/server';

import { updateExchangeRates } from '@/libs/exchange-rates/update-rates';

export async function GET(request: Request) {
  try {
    // Verify the request is from a trusted source (e.g., cron job service)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const result = await updateExchangeRates();

    if (!result.success) {
      return new NextResponse(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
