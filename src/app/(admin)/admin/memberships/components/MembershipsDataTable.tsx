'use client';

import { format } from 'date-fns';

import { DataTable } from '@/app/(admin)/admin/components/DataTable';
import { Tables } from '@/libs/supabase/types';

import { columns } from './columns';

type Member = Pick<
  Tables<'members'>,
  'id' | 'first_name' | 'last_name' | 'email' | 'contact_number' | 'date_of_birth' | 'nationality' | 'is_primary'
>;

type Quote = Pick<
  Tables<'quotes'>,
  | 'id'
  | 'created_at'
  | 'base_price'
  | 'tax_amount'
  | 'total_price_with_tax'
  | 'currency'
  | 'coverage_loading_price'
  | 'discount_amount'
  | 'gbp_total'
  | 'medical_loading_price'
  | 'member_prices'
  | 'total_price'
>;

type Membership = Tables<'memberships'> & {
  quotes: Quote[];
  members: Member[];
  users: {
    email: string;
  } | null;
};

interface MembershipsDataTableProps {
  data: Membership[];
}

// Custom global filter function for complex nested data
const membershipGlobalFilter = (membership: Membership, query: string): boolean => {
  if (!query) return true;

  const searchQuery = query.toLowerCase().trim();

  // Search in policy number (both raw and formatted)
  const membershipNumber = String(membership.membership_number);
  const formattedPolicyNumber = `GOASK-J-98001/${membershipNumber.padStart(4, '0')}`;
  if (
    membershipNumber.toLowerCase().includes(searchQuery) ||
    formattedPolicyNumber.toLowerCase().includes(searchQuery) ||
    searchQuery.includes(membershipNumber)
  ) {
    return true;
  }

  // Search in primary member name
  const primaryMember = membership.members?.find((member) => member.is_primary);
  if (primaryMember) {
    const fullName = `${primaryMember.first_name} ${primaryMember.last_name}`.toLowerCase();
    const firstName = primaryMember.first_name?.toLowerCase() || '';
    const lastName = primaryMember.last_name?.toLowerCase() || '';

    if (fullName.includes(searchQuery) || firstName.includes(searchQuery) || lastName.includes(searchQuery)) {
      return true;
    }
  }

  // Search in membership type
  if (membership.membership_type?.toLowerCase().includes(searchQuery)) {
    return true;
  }

  // Search in coverage type (location coverage)
  if (membership.coverage_type?.toLowerCase().includes(searchQuery)) {
    return true;
  }

  // Search in status
  if (membership.status?.toLowerCase().includes(searchQuery)) {
    return true;
  }

  // Search in formatted date
  if (membership.created_at) {
    try {
      const formattedDate = format(new Date(membership.created_at), 'PPP').toLowerCase();
      if (formattedDate.includes(searchQuery)) {
        return true;
      }

      // Also search in ISO date format
      if (membership.created_at.toLowerCase().includes(searchQuery)) {
        return true;
      }
    } catch (error) {
      // If date parsing fails, search in raw date string
      if (membership.created_at.toLowerCase().includes(searchQuery)) {
        return true;
      }
    }
  }

  // Search in user email if available
  if (membership.users?.email?.toLowerCase().includes(searchQuery)) {
    return true;
  }

  return false;
};

export function MembershipsDataTable({ data }: MembershipsDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      from='memberships'
      searchPlaceholder='Search by names, type, coverage, or date...'
      customGlobalFilter={membershipGlobalFilter}
    />
  );
}
