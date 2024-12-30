export const NATIONALITIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  // Add more as needed
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'SGD', symbol: 'S$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'NZD', symbol: 'NZ$' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'ZAR', symbol: 'R' },

] as const;

export const SALUTATIONS = ['Dr', 'Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Master'] as const;

export const COUNTRY_CODES = [
  { code: '+1', name: 'USA/Canada' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'Australia' },
  { code: '+81', name: 'Japan' },
  { code: '+65', name: 'Singapore' },
  // Add more as needed
] as const;

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  // Add more as needed
] as const;

export const EXCLUDED_NATIONALITIES = [
  // Add restricted nationalities
] as const;
export const REFERRAL_SOURCES = [
  'Search Engine (Google, Yahoo, Bing)',
  'Word of Mouth',
  'Recommended by a Friend',
  'Online Advertisement & Social Media',
  'Tour Operator',
  'My Bank',
  'Other (please specify)',
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];
