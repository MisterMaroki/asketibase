import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Database } from '@/libs/supabase/types';

export async function updateMember(id: string, data: Partial<Database['public']['Tables']['members']['Row']>) {
  const { data: updatedData, error } = await supabaseAdminClient.from('members').update(data).eq('id', id).select();
  if (error) {
    console.error(error);
  }
  return updatedData;
}

export async function createMember(data: Partial<Database['public']['Tables']['members']['Row']>) {
  const { data: createdData, error } = await supabaseAdminClient
    .from('members')
    .insert(data as any)
    .select();
  if (error) {
    console.error(error);
  }
  return createdData;
}

export async function getMembershipMembers(membershipId: string) {
  const { data, error } = await supabaseAdminClient.from('members').select('*').eq('membership_id', membershipId);
  if (error) {
    console.error(error);
  }
  return data;
}
