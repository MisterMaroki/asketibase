export const MEMBERSHIP_TYPES = {
  INDIVIDUAL: 'Individual Membership',
  COUPLE: 'Couples Membership',
  FAMILY: 'Family & Group Membership',
} as const;

export const COVERAGE_TYPES = {
  WORLDWIDE: 'Worldwide Comprehensive',
  PLATINUM: 'Worldwide Platinum',
} as const;

export const COVERAGE_DESCRIPTIONS = {
  WORLDWIDE: 'Excluding High Risk Countries',
  PLATINUM: 'Including High Risk Countries',
} as const;

export const BASE_PRICES = {
  WORLDWIDE: {
    INDIVIDUAL: 1000,
    COUPLE: 1800,
    FAMILY: 2500,
  },
  PLATINUM: {
    INDIVIDUAL: 2000,
    COUPLE: 3600,
    FAMILY: 5000,
  },
} as const;

// Duration types must match the database values
export const DURATION_TYPES = {
  expat_year: 'expat_year',
  multi_trip: 'multi_trip',
  single_trip: 'single_trip',
} as const;

export const DURATION_MAX_TRIP_DURATION = {
  expat_year: 365,
  multi_trip: 28,
  single_trip: 180,
} as const;

export const getDurationDetails = (durationType: keyof typeof DURATION_TYPES) => {
  return DURATION_DETAILS[durationType];
};

export const DURATION_DETAILS = {
  expat_year: {
    title: 'Expat Year',
    description: '365 Days Contiguous Coverage from Membership Start Date - No Maximum Trip Duration',
    maxTripDuration: DURATION_MAX_TRIP_DURATION.expat_year,
  },
  multi_trip: {
    title: 'Annual Multi-Trip',
    description: 'Multiple Trips a Year, Maximum 28 Day Trip Duration (Maximum 45 Days Aggregated Duration Per Year)',
    maxTripDuration: DURATION_MAX_TRIP_DURATION.multi_trip,
  },
  single_trip: {
    title: 'Single Trip Cover',
    description: 'Policy Holder Specifies Coverage Duration: Minimum 7 Days; Maximum 180 Day',
    maxTripDuration: DURATION_MAX_TRIP_DURATION.single_trip,
  },
} as const;

export const MEMBER_LIMITS = {
  INDIVIDUAL: 1,
  COUPLE: 2,
  FAMILY: 15,
} as const;

export const HIGH_RISK_COUNTRIES = ['Russia', 'China', 'Iran', 'North Korea', 'Cuba', 'Belarus'] as const;

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