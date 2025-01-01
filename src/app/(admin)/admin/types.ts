import { Tables } from '@/libs/supabase/types';

export type DetailsType = 'members' | 'memberships' | 'quotes';
export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
  contact_number?: string;
  country_code?: string;
  is_primary: boolean;
  has_conditions: boolean;
}

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
