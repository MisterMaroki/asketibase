'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function createSession() {
  const { data: session, error } = await supabaseAdminClient.from('membership_sessions').insert({}).select().single();

  if (error) {
    throw new Error('Failed to create session');
  }

  return session;
}

export async function getSession(sessionId: string) {
  // First check if there are any non-draft memberships for this session
  const { data: memberships, error: membershipError } = await supabaseAdminClient
    .from('memberships')
    .select('status')
    .eq('session_id', sessionId)
    .neq('status', 'draft')
    .limit(1);

  if (membershipError) {
    return null;
  }

  // If there are any non-draft memberships, return null to force a new session
  if (memberships && memberships.length > 0) {
    return null;
  }

  // If no non-draft memberships, check the session
  const { data: session, error } = await supabaseAdminClient
    .from('membership_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
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
