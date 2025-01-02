import { Database } from '@/libs/supabase/types';

export type Member = Database['public']['Tables']['members']['Row'];
export type Membership = Database['public']['Tables']['memberships']['Row'] & {
  members?: Member[];
  quotes?: Quote[];
};
export type Quote = Database['public']['Tables']['quotes']['Row'];
export type DetailsType = 'members' | 'memberships' | 'quotes';
