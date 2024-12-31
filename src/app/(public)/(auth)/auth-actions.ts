'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { ActionResponse } from '@/types/action-response';
import { getURL } from '@/utils/get-url';

export async function signInWithOAuth(provider: 'apple' | 'google', returnUrl?: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const redirectUrl = new URL('/auth/callback', getURL());
  if (returnUrl) {
    redirectUrl.searchParams.set('returnUrl', returnUrl);
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl.toString(),
      queryParams: {
        returnTo: getURL(),
      },
    },
  });

  if (error) {
    console.error(error);
    return { data: null, error: error.message, success: false };
  }

  return redirect(data.url);
}

export async function signInWithEmail(email: string, returnUrl?: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const redirectUrl = new URL('/auth/callback', getURL());
  if (returnUrl) {
    redirectUrl.searchParams.set('returnUrl', returnUrl);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl.toString(),
      data: {
        returnTo: getURL(),
      },
    },
  });

  if (error) {
    console.error(error);
    return { data: null, error: error.message, success: false };
  }

  return { data: null, error: undefined, success: true };
}

export async function signInWithEmailAndPassword(email: string, password: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { data: null, error: error.message, success: false };
  }

  return { data: null, error: undefined, success: true };
}

export async function signOut(): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return { data: null, error: error.message, success: false };
  }

  redirect('/');
}
