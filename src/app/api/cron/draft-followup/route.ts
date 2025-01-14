'use server';

import { NextResponse } from 'next/server';

import { DraftFollowupEmail } from '@/features/emails/draft-followup';
import { logOperation } from '@/features/membership/actions/log-action';
import { resendClient } from '@/libs/resend/resend-client';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function POST(request: Request) {
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

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    logOperation({
      level: 'info',
      operation: 'draft_followups_started',
      details: {
        message: 'Starting draft followups',
      },
    });

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: memberships, error: membershipError } = await supabaseAdminClient
      .from('memberships')
      .select('*, members!inner(*)')
      .eq('status', 'draft')
      .lte('updated_at', fifteenMinutesAgo)
      .is('followup_sent', null);

    if (membershipError) throw membershipError;

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ message: 'No draft memberships to process' });
    }

    const emailPromises = memberships.map(async (membership) => {
      const primaryMember = membership.members.find((m) => m.is_primary);
      if (!primaryMember) return;

      try {
        await resendClient.emails.send({
          from: 'ASKETI <memberships@asketi.com>',
          to: primaryMember.email,
          // to: 'omar987@hotmail.co.uk',
          subject: 'Complete Your ASKETI Membership Application',
          react: DraftFollowupEmail({
            firstName: primaryMember.first_name,
            membershipNumber: `GOASK-J-98001/${membership.membership_number}`,
            // firstName: 'Omar',
            // membershipNumber: `GOASK-J-98001/123456`,
          }),
        });

        logOperation({
          level: 'info',
          operation: 'draft_followup_sent',
          details: {
            membershipId: membership.id,
            emailSent: true,
          },
        });

        await supabaseAdminClient
          .from('memberships')
          .update({ followup_sent: new Date().toISOString() })
          .eq('id', membership.id);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      processed: memberships?.length || 0,
    });
  } catch (error: unknown) {
    console.error('Error in draft followup cron:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
