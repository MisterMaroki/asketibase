// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { getURL } from '@/utils/get-url';

const siteUrl = getURL();
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

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
      // Get the user first from user id in users table
      if (user.email) {
        // Check if user's email is in admins table
        const { data: isAdmin } = await supabase.from('admins').select('id').eq('id', user.id).single();

        if (!isAdmin) {
          return NextResponse.redirect(`${siteUrl}/`);
        } else {
          const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
          const isLocalEnv = process.env.NODE_ENV === 'development';
          if (isLocalEnv) {
            // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
            return NextResponse.redirect(`${origin}${next}`);
          } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}${next}`);
          } else {
            return NextResponse.redirect(`${origin}${next}`);
          }
        }
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
