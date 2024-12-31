import { Tables } from '@/libs/supabase/types';

export type DetailsType = 'members' | 'memberships' | 'quotes';
export type Member = Pick<
  Tables<'members'>,
  'id' | 'first_name' | 'last_name' | 'email' | 'contact_number' | 'date_of_birth' | 'nationality' | 'is_primary'
>;

export type Quote = {
  id: string;
  created_at: string;
  base_price: number;
  tax_amount: number;
  total_price_with_tax: number;
  currency: string;
  coverage_loading_price: number;
  discount_amount: number;
  gbp_total: number | null;
  medical_loading_price: number;
  member_prices: any;
  total_price: number;
  membership_id: string;
  referral_code_id: string | null;
  memberships?: {
    id: string;
    membership_type: string;
    coverage_type: string;
    status: string;
    members: Member[];
  } | null;
};

export type Membership = {
  id: string;
  created_at: string | null;
  membership_type: string;
  coverage_type: string;
  duration_type: 'expat_year' | 'multi_trip' | 'single_trip';
  start_date: string | null;
  end_date: string | null;
  status: string;
  membership_number: number;
  user_id: string | null;
  quotes: Quote[];
  members: Member[];
  users: {
    email: string;
  } | null;
};
