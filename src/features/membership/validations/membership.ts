import { type Membershipschema, membershipSchema } from './schemas';

export function validateApplication(data: Partial<Membershipschema>) {
  try {
    membershipSchema.safeParse(data);
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
      errors: ['Invalid membership data'],
    };
  }
}

export function isApplicationValid(data: Partial<Membershipschema>): boolean {
  const result = validateApplication(data);
  return result.success;
}

export function getApplicationValidationErrors(data: Partial<Membershipschema>) {
  const result = validateApplication(data);
  if (result.success) return [];

  return Array.isArray(result.errors) ? result.errors : Object.values(result.errors).flat();
}
