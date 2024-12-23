// 'use client';

import * as z from 'zod';

import { COVERAGE_TYPES, DURATION_TYPES, MEMBERSHIP_TYPES } from '@/constants/membership';
import { COUNTRY_CODES, SALUTATIONS } from '@/constants/options';

// UUID regex pattern
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Base schemas
export const uuidSchema = z.string().regex(UUID_PATTERN, 'Invalid ID format');

export const addressSchema = z
  .string()
  .min(10, 'Address must be at least 10 characters long')
  .regex(/\s/, 'Please enter a complete address')
  .transform((val) => val.trim());

// Member schemas
export const memberSchema = z.object({
  id: z.string().optional(),
  salutation: z.enum(SALUTATIONS as unknown as [string, ...string[]]),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['male', 'female']),
  nationality: uuidSchema.describe('Nationality'),
  countryCode: z.enum(COUNTRY_CODES.map((c) => c.code) as [string, ...string[]]),
  contactNumber: z.string().min(5, 'Contact number is required'),
  email: z.string().email('Invalid email address'),
  countryOfResidence: uuidSchema.describe('Country of residence'),
  address: addressSchema,
});

export type MemberSchema = z.infer<typeof memberSchema>;

// Application schemas
export const applicationSchema = z.object({
  membershipType: z.enum(Object.keys(MEMBERSHIP_TYPES) as [string, ...string[]]),
  coverageType: z.enum(Object.keys(COVERAGE_TYPES) as [string, ...string[]]),
  durationType: z.enum(Object.values(DURATION_TYPES) as [string, ...string[]]),
  currency: z.string().min(3, 'Currency is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  members: z.array(memberSchema).min(1, 'At least one member is required'),
  referralCode: z.string().optional(),
  referralSource: z.string().optional().nullable(),
  medicalState: z.object({
    memberConditions: z.record(z.string(), z.boolean()),
    completedMembers: z.record(z.string(), z.number()),
    hasDeclinedMember: z.boolean(),
  }),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
