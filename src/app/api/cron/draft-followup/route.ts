import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { DraftFollowupEmail } from '@/features/emails/draft-followup';
import { resendClient } from '@/libs/resend/resend-client';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: memberships, error: membershipError } = await supabaseAdminClient
      .from('memberships')
      .select('*, members!inner(*)')
      .eq('status', 'draft')
      .lt('updated_at', fifteenMinutesAgo)
      .is('followup_sent', null);

    if (membershipError) throw membershipError;

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ message: 'No draft memberships to process' });
    }

    // const emailPromises = memberships.map(async (membership) => {
    //   const primaryMember = membership.members.find((m) => m.is_primary);
    //   if (!primaryMember) return;

    //   try {
    await resendClient.emails.send({
      from: 'ASKETI <memberships@asketi.com>',
      // to: primaryMember.email,
      to: 'omar987@hotmail.co.uk',
      subject: 'Complete Your ASKETI Membership Application',
      react: DraftFollowupEmail({
        // firstName: primaryMember.first_name,
        // membershipNumber: `GOASK-J-98001/${membership.membership_number}`,
        firstName: 'Omar',
        membershipNumber: `GOASK-J-98001/123456`,
      }),
    });

    //     await supabaseAdminClient
    //       .from('memberships')
    //       .update({ followup_sent: new Date().toISOString() })
    //       .eq('id', membership.id);
    //   } catch (error) {
    //     console.error('Error sending email:', error);
    //   }
    // });

    // await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      processed: memberships.length,
    });
  } catch (error: unknown) {
    console.error('Error in draft followup cron:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}