'use client';

import type { Member } from '@/store/membership-store';

import { type MemberSchema, memberSchema } from './schemas';

export function validateMember(member: Partial<Member>) {
  try {
    memberSchema.parse(member);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: JSON.parse(error.message),
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
  console.log('🚀 ~ getMemberValidationErrors ~ result:', result);
  if (result.success) return [];

  return Array.isArray(result.errors) ? result.errors : Object.values(result.errors).flat();
}
