'use server';

import { createSupabaseServerClient } from '@/libs/supabase/server-client';

export async function checkAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return false;
  }

  const { data: user, error: userError } = await supabase.from('admins').select('*').eq('id', data.user?.id).single();

  if (userError) {
    console.error(userError);
    return false;
  }

  return !!user;
}
