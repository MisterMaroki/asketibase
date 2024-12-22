'use client';

export function isValidAddress(address: string | undefined | null): boolean {
  if (!address) return false;
  // Basic validation - at least 10 characters with some structure
  return address.trim().length >= 10 && address.includes(' ');
}

export function getAddressError(address: string | undefined | null): string | null {
  if (!address) {
    return 'Address is required';
  }
  if (address.trim().length < 10) {
    return 'Address must be at least 10 characters long';
  }
  if (!address.includes(' ')) {
    return 'Please enter a complete address';
  }
  return null;
}