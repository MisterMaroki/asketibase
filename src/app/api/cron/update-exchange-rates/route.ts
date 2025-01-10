'use server';
import { NextResponse } from 'next/server';

import { updateExchangeRates } from '@/libs/exchange-rates/update-rates';

export async function GET(request: Request) {
  try {
    // Log the incoming request headers for debugging
    const authHeader = request.headers.get('authorization');
    console.log('Received auth header:', authHeader);
    console.log('Expected auth header:', `Bearer ${process.env.CRON_SECRET}`);

    // Check if auth header exists
    if (!authHeader) {
      return new NextResponse(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the request is from a trusted source
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse(JSON.stringify({ error: 'Invalid authorization token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
