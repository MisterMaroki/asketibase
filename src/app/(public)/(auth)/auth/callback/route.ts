// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { getURL } from '@/utils/get-url';

const siteUrl = getURL();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const returnUrl = requestUrl.searchParams.get('returnUrl');

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        return NextResponse.redirect(`${siteUrl}/login`);
      }

      // If there's a returnUrl, use it regardless of admin status
      if (returnUrl) {
        return NextResponse.redirect(`${siteUrl}${returnUrl}`);
      }

      // Otherwise, check admin status for default redirect
      if (user.email) {
        const { data: isAdmin } = await supabase.from('admins').select('*').eq('id', user.id).single();
        if (isAdmin) {
          return NextResponse.redirect(`${siteUrl}/admin`);
        }
      }

      // Default redirect for non-admins
      return NextResponse.redirect(`${siteUrl}/membership`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
}
