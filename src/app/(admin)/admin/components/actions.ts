'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { DetailsType, Membership } from '../types';

async function getMembershipById(id: string): Promise<Membership | null> {
  const { data, error } = await supabaseAdminClient
    .from('memberships')
    .select(
      `
      *,
      members (
       *
      ),
      quotes (
       *
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching membership:', error);
    return null;
  }

  return data as unknown as Membership;
}

export async function getDetails(type: DetailsType, id: string): Promise<Membership | null> {
  try {
    console.log('getDetails called with:', { type, id });

    switch (type) {
      case 'members': {
        // Get the member's membership ID first
        const { data: member, error: memberError } = await supabaseAdminClient
          .from('members')
          .select('membership_id')
          .eq('id', id)
          .single();

        if (memberError || !member?.membership_id) {
          console.error('Error fetching member:', memberError);
          return null;
        }

        return getMembershipById(member.membership_id);
      }

      case 'memberships':
        return getMembershipById(id);

      case 'quotes': {
        // Get the quote's membership ID first
        const { data: quote, error: quoteError } = await supabaseAdminClient
          .from('quotes')
          .select('membership_id')
          .eq('id', id)
          .single();

        console.log('Quote data:', quote);

        if (quoteError || !quote?.membership_id) {
          console.error('Error fetching quote:', quoteError);
          return null;
        }

        console.log('Found membership_id for quote:', quote.membership_id);
        return getMembershipById(quote.membership_id);
      }

      default:
        throw new Error('Invalid type');
    }
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}
