'use server';

import { revalidatePath } from 'next/cache';

import { logOperation } from '@/features/membership/actions/log-action';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Tables } from '@/libs/supabase/types';
import { ActionResponse } from '@/types/action-response';

type CountryBasePrice = Tables<'country_base_prices'>;

export async function updateCountryBasePrice(id: string, updates: Partial<CountryBasePrice>): Promise<ActionResponse> {
  try {
    const { error } = await supabaseAdminClient.from('country_base_prices').update(updates).eq('id', id);

    if (error) throw error;

    await logOperation({
      level: 'info',
      operation: 'update_country_base_price',
      details: {
        country: updates.country,
        price: updates.base_price,
      },
    });

    revalidatePath('/admin/pricing');
    return { success: true };
  } catch (error) {
    console.error('Error updating price:', error);
    return {
      success: false,
      error: 'Failed to update price',
    };
  }
}

export async function getCountryBasePrices(): Promise<CountryBasePrice[]> {
  try {
    const { data, error } = await supabaseAdminClient.from('country_base_prices').select('*').order('country');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting country base prices:', error);
    return [];
  }
}
