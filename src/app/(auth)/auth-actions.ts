'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { ActionResponse } from '@/types/action-response';
import { getURL } from '@/utils/get-url';

// export async function signInWithOAuth(provider: 'github' | 'google'): Promise<ActionResponse> {
//   const supabase = await createSupabaseServerClient();

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider,
//     options: {
//       redirectTo: getURL('/auth/callback'),
//     },
//   });

//   if (error) {
//     console.error(error);
//     return { data: null, error: error };
//   }

//   return redirect(data.url);
// }

export async function signInWithEmail(email: string, password: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { data: null, error: error.message, success: false };
  }

  redirect('/admin');

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

  return { data: null, error: undefined, success: true };
}
