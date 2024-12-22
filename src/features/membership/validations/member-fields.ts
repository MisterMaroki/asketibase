'use client';

import type { Member } from '@/store/membership-store';

// Validate required fields for member
export function isMemberValid(member: Partial<Member>): boolean {
  return Boolean(
    member.salutation &&
      member.firstName &&
      member.lastName &&
      member.dateOfBirth &&
      member.gender &&
      member.nationality &&
      member.countryCode &&
      member.contactNumber &&
      member.email &&
      member.countryOfResidence &&
      isValidAddress(member.address) &&
      isValidCountryId(member.nationality) &&
      isValidCountryId(member.countryOfResidence)
  );
}

// Validate UUID format for country IDs
export function isValidCountryId(id: string | undefined | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// Validate address format
export function isValidAddress(address: string | undefined | null): boolean {
  if (!address) return false;
  return address.trim().length >= 10 && address.includes(' ');
}

// Get validation errors for member fields
export function getMemberValidationErrors(member: Partial<Member>): string[] {
  const errors: string[] = [];

  if (!member.nationality || !isValidCountryId(member.nationality)) {
    errors.push('Please select a valid nationality');
  }

  if (!member.countryOfResidence || !isValidCountryId(member.countryOfResidence)) {
    errors.push('Please select a valid country of residence');
  }

  if (!isValidAddress(member.address)) {
    errors.push('Please enter a complete address (minimum 10 characters)');
  }

  return errors;
}
