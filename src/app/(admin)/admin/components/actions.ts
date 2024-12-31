'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getDetails(type: 'member' | 'membership' | 'quote', id: string) {
  try {
    switch (type) {
      case 'member':
        const { data: member } = await supabaseAdminClient
          .from('members')
          .select(
            `
            *,
            memberships (
              *,
              quotes (*)
            )
          `,
          )
          .eq('id', id)
          .single();
        return member;

      case 'membership':
        const { data: membership } = await supabaseAdminClient
          .from('memberships')
          .select(
            `
            *,
            members (*),
            quotes (*)
          `,
          )
          .eq('id', id)
          .single();
        return membership;

      case 'quote':
        const { data: quote } = await supabaseAdminClient
          .from('quotes')
          .select(
            `
            *,
            membership:memberships (
              *,
              members (*)
            )
          `,
          )
          .eq('id', id)
          .single();
        return quote;

      default:
        throw new Error('Invalid type');
    }
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
}
