'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { ActionResponse } from '@/types/action-response';

export async function toggleDiscountCode(id: string, active: boolean): Promise<ActionResponse> {
  try {
    const { error } = await supabaseAdminClient.from('fires').update({ active }).eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/discount-codes');
    return { success: true };
  } catch (error) {
    console.error('Error toggling discount code:', error);
    return {
      success: false,
      error: 'Failed to update discount code',
    };
  }
}

export async function createDiscountCode(data: { code: string; discount_percent: number }): Promise<ActionResponse> {
  try {
    const { error } = await supabaseAdminClient.from('fires').insert({
      code: data.code,
      discount_percent: data.discount_percent,
      active: true,
    });

    if (error) throw error;

    revalidatePath('/admin/discount-codes');
    return { success: true };
  } catch (error) {
    console.error('Error creating discount code:', error);
    return {
      success: false,
      error: 'Failed to create discount code',
    };
  }
}
