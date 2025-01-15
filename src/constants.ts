export const MEMBERSHIP_TYPES = {
  INDIVIDUAL: 'Individual Membership',
  COUPLE: 'Couples Membership',
  FAMILY: 'Family & Group Membership',
} as const;

export const COVERAGE_TYPES = {
  BASIC: 'Worldwide (excluding USA, Canada, Mexico, Greenland, Bermuda & Caribbean)',
  PLATINUM: 'Worldwide',
} as const;

export const DURATION_TYPES = {
  expat_year: 'expat_year',
  multi_trip: 'multi_trip',
  single_trip: 'single_trip',
} as const;

export const DURATION_MAX_TRIP_DURATION = {
  expat_year: 365,
  multi_trip: 31,
  single_trip: 365,
} as const;

export const getDurationDetails = (durationType: keyof typeof DURATION_TYPES) => {
  return DURATION_DETAILS[durationType];
};

export const DURATION_DETAILS = {
  expat_year: {
    title: '365 Days Continuous Coverage',
    description: '365 Days Continuous Coverage from Membership Start Date - No Maximum Trip Duration',
    maxTripDuration: DURATION_MAX_TRIP_DURATION.expat_year,
  },
  multi_trip: {
    title: 'Annual Multi-Trip',
    description: 'Multiple Trips a Year, Maximum 31 Day Trip Duration (Maximum 60 Days Aggregated Duration Per Year)',
    maxTripDuration: DURATION_MAX_TRIP_DURATION.multi_trip,
  },
  single_trip: {
    title: 'Single Trip Cover',
    description: 'Policy Holder Specifies Coverage Duration: Minimum 2 Days; Maximum 365 Days',
    maxTripDuration: DURATION_MAX_TRIP_DURATION.single_trip,
  },
} as const;

export const MEMBER_LIMITS = {
  INDIVIDUAL: 1,
  COUPLE: 2,
  FAMILY: 15,
} as const;

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
  { code: '+1', name: 'us', label: 'United States' },
  { code: '+1', name: 'ca', label: 'Canada' },
  { code: '+44', name: 'gb', label: 'United Kingdom' },
  { code: '+61', name: 'au', label: 'Australia' },
  { code: '+81', name: 'jp', label: 'Japan' },
  { code: '+65', name: 'sg', label: 'Singapore' },
  { code: '+49', name: 'de', label: 'Germany' },
  { code: '+33', name: 'fr', label: 'France' },
  { code: '+39', name: 'it', label: 'Italy' },
  { code: '+34', name: 'es', label: 'Spain' },
  { code: '+31', name: 'nl', label: 'Netherlands' },
  { code: '+86', name: 'cn', label: 'China' },
  { code: '+91', name: 'in', label: 'India' },
  { code: '+82', name: 'kr', label: 'South Korea' },
  { code: '+7', name: 'ru', label: 'Russia' },
  { code: '+55', name: 'br', label: 'Brazil' },
  { code: '+52', name: 'mx', label: 'Mexico' },
  { code: '+27', name: 'za', label: 'South Africa' },
  { code: '+971', name: 'ae', label: 'United Arab Emirates' },
  { code: '+966', name: 'sa', label: 'Saudi Arabia' },
  { code: '+64', name: 'nz', label: 'New Zealand' },
  { code: '+353', name: 'ie', label: 'Ireland' },
  { code: '+46', name: 'se', label: 'Sweden' },
  { code: '+47', name: 'no', label: 'Norway' },
  { code: '+45', name: 'dk', label: 'Denmark' },
  { code: '+358', name: 'fi', label: 'Finland' },
  { code: '+48', name: 'pl', label: 'Poland' },
  { code: '+43', name: 'at', label: 'Austria' },
  { code: '+41', name: 'ch', label: 'Switzerland' },
  { code: '+32', name: 'be', label: 'Belgium' },
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
