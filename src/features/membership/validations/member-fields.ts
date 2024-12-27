'use client';

import type { Member } from '@/store/membership-store';

// Validate required fields for member
export function isMemberValid(member: Partial<Member>): boolean {
  const isValid = Boolean(
    member?.salutation &&
      member?.firstName &&
      member?.lastName &&
      member?.dateOfBirth &&
      new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear() <= 85 &&
      member?.gender &&
      member?.nationality &&
      member?.countryCode &&
      member?.contactNumber &&
      member?.email &&
      member?.countryOfResidence &&
      isValidAddress(member?.address) &&
      isValidCountryId(member?.nationality) &&
      isValidCountryId(member?.countryOfResidence)
  );
  return isValid;
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

  if (!member?.nationality || !isValidCountryId(member?.nationality)) {
    errors.push('Please select a valid nationality');
  }

  if (!member?.countryOfResidence || !isValidCountryId(member?.countryOfResidence)) {
    errors.push('Please select a valid country of residence');
  }

  if (!member?.dateOfBirth) {
    errors.push('Please enter a date of birth');
  }

  if (member?.dateOfBirth && new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear() > 85) {
    errors.push('Member must be 85 years or younger');
  }

  if (!isValidAddress(member?.address)) {
    errors.push('Please enter a complete address (minimum 10 characters)');
  }

  if (!member?.salutation) {
    errors.push('Please select a salutation');
  }

  if (!member?.firstName) {
    errors.push('Please enter a first name');
  }

  if (!member?.lastName) {
    errors.push('Please enter a last name');
  }

  if (!member?.gender) {
    errors.push('Please select a gender');
  }

  if (!member?.contactNumber) {
    errors.push('Please enter a contact number');
  }

  if (!member?.email) {
    errors.push('Please enter an email address');
  }

  return errors;
}
