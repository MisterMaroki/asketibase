import { createSupabaseServerClient } from '@/libs/supabase/server-client';

export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error(userError);
  }

  const { data, error } = await supabase.from('users').select('*').single();

  if (error) {
    console.error(error);
  }

  return data;
}
