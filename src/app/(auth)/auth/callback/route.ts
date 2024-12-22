// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { getURL } from '@/utils/get-url';

const siteUrl = getURL();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.redirect(`${siteUrl}/login`);
    }
    // Get the user first from user id in users table
    if (user.email) {
      // Check if user's email is in admins table
      const { data: isAdmin } = await supabase.from('admins').select('email').eq('email', user.email).single();

      if (!isAdmin) {
        return NextResponse.redirect(`${siteUrl}/membership`);
      } else {
        return NextResponse.redirect(`${siteUrl}`);
      }
    }

    return NextResponse.redirect(siteUrl);
  }
}
