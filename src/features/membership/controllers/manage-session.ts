'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function createSession() {
  const { data: session, error } = await supabaseAdminClient.from('membership_sessions').insert({}).select().single();

  if (error) {
    // console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }

  return session;
}

export async function getSession(sessionId: string) {
  const { data: session, error } = await supabaseAdminClient
    .from('membership_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    // console.error('Error getting session:', error);
    return null;
  }

  return session;
}

export async function getMembershipBySession(sessionId: string) {
  const { data: membership, error } = await supabaseAdminClient
    .from('memberships')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    // console.error('Error getting membership by session:', error);
    return null;
  }

  return membership;
}
