'use client';

import { ZodError } from 'zod';

import type { Member } from '@/store/membership-store';

import { type MemberSchema, memberSchema } from './schemas';

interface ValidationSuccess {
  success: true;
  errors: null;
}

interface ValidationError {
  success: false;
  errors: string[];
}

type ValidationResult = ValidationSuccess | ValidationError;

export function validateMember(member: Partial<Member>): ValidationResult {
  try {
    memberSchema.parse(member);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => err.message),
      };
    }
    return {
      success: false,
      errors: ['Invalid member data'],
    };
  }
}

export function isMemberValid(member: Partial<Member>): boolean {
  const result = validateMember(member);
  return result.success;
}

export function getMemberValidationErrors(member: Partial<Member>): string[] {
  const result = validateMember(member);
  if (result.success) return [];
  return result.errors;
}
