'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { COVERAGE_TYPES, DURATION_TYPES, MEMBERSHIP_TYPES } from '@/constants/membership';
export interface Member {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: 'male' | 'female';
  nationality: string;
  countryCode: string;
  contactNumber: string;
  email: string;
  countryOfResidence: string;
  address: string;
  medicalDeclaration?: {
    responses: Record<string, string>;
    acceptedDisclaimer: boolean;
    submittedAt: string;
  };
}

export type MembershipState = {
  currentStep: number;
  eligibilityAccepted: boolean;
  membershipType: keyof typeof MEMBERSHIP_TYPES | null;
  coverageType: keyof typeof COVERAGE_TYPES | null;
  durationType: keyof typeof DURATION_TYPES | null;
  currency: string | null;
  startDate: string | null;
  endDate: string | null;
  members: Member[];
  referralCode: string;
  referralSource: string | null;
  originalState: {
    membershipType: keyof typeof MEMBERSHIP_TYPES | null;
    coverageType: keyof typeof COVERAGE_TYPES | null;
    members: Member[];
  } | null;
  medicalState: {
    memberConditions: Record<string, boolean>;
    completedMembers: Record<string, number>;
    hasDeclinedMember: boolean;
  };
  errors: Record<string, string>;
  // };

  // export type MembershipActions = {
  setStep: (step: number) => void;
  setEligibility: (accepted: boolean) => void;
  setMembershipType: (type: keyof typeof MEMBERSHIP_TYPES) => void;
  setCoverageType: (type: keyof typeof COVERAGE_TYPES) => void;
  setDurationType: (type: keyof typeof DURATION_TYPES) => void;
  setCurrency: (currency: string) => void;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  setReferralSource: (source: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  saveOriginalState: () => void;
  clearOriginalState: () => void;
  hasStateChanged: () => boolean;
  removeMember: (id: string) => void;
  setReferralCode: (code: string) => void;
  setMedicalState: (state: MembershipState['medicalState']) => void;
  clearMedicalState: () => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  reset: () => void;
};

// Default member for testing
const defaultMember: Member = {
  id: crypto.randomUUID(),
  salutation: 'Mr',
  firstName: 'John',
  lastName: 'Smith',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  nationality: 'adcd6d95-e964-442e-aed2-c89e86007459',
  countryCode: '+1',
  contactNumber: '2025550123',
  email: 'john.smith@example.com',
  countryOfResidence: 'adcd6d95-e964-442e-aed2-c89e86007459',
  address: '123 Main St, New York, NY 10001',
};

// Default state
const defaultState = {
  currentStep: 1,
  eligibilityAccepted: true,
  membershipType: 'INDIVIDUAL' as keyof typeof MEMBERSHIP_TYPES,
  coverageType: 'WORLDWIDE' as keyof typeof COVERAGE_TYPES,
  durationType: 'expat_year' as keyof typeof DURATION_TYPES,
  currency: 'USD',
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
  endDate: null,
  // members: [defaultMember],
  members: [],
  referralCode: 'WELCOME10',
  referralSource: null,
  originalState: null,
  medicalState: {
    memberConditions: {},
    completedMembers: {},
    hasDeclinedMember: false,
  },
  errors: {},
};

// Persist configuration
const persistConfig = {
  name: 'membership-store',
  skipHydration: true,
  // storage,
  // partialize: (state: MembershipState) => ({
  //   ...state,
  //   startDate: state.startDate?.toISOString(),
  //   endDate: state.endDate?.toISOString(),
  //   members: state.members.map((member) => ({
  //     ...member,
  //     dateOfBirth: member.dateOfBirth?.toISOString(),
  //   })),
  // }),
  // deserialize: (state: any) => ({
  //   ...state,
  //   startDate: state.startDate ? new Date(state.startDate) : null,
  //   endDate: state.endDate ? new Date(state.endDate) : null,
  //   members: state.members.map((member: any) => ({
  //     ...member,
  //     dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
  //   })),
  // }),
};

export const useMembershipStore = create<MembershipState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setStep: (step) => set({ currentStep: step }),
      setEligibility: (accepted) => set({ eligibilityAccepted: accepted }),
      setMembershipType: (type) => set({ membershipType: type }),
      setCoverageType: (type) => set({ coverageType: type }),
      setDurationType: (type) => set({ durationType: type }),
      setCurrency: (currency) => set({ currency }),
      setStartDate: (date) => set({ startDate: date }),
      setEndDate: (date) => set({ endDate: date }),
      setReferralSource: (source) => set({ referralSource: source }),
      addMember: (member) =>
        set((state) => ({
          members: [...state.members, { ...member, id: crypto.randomUUID() }],
        })),
      updateMember: (id, member) =>
        set((state) => {
          const hasKeyDetailsChanged =
            state.members.find((m) => m.id === id) &&
            Object.entries(member).some(([key, value]) => {
              if (
                !['firstName', 'lastName', 'dateOfBirth', 'nationality', 'gender', 'countryOfResidence'].includes(key)
              ) {
                return false;
              }
              if (key === 'dateOfBirth') {
                const existingMember = state.members.find((m) => m.id === id);
                const existingDate = existingMember?.dateOfBirth;
                const newDate = value;
                return existingDate !== newDate;
              }
              return value !== undefined && value !== state.members.find((m) => m.id === id)?.[key as keyof Member];
            });

          const updatedMedicalState: MembershipState['medicalState'] = hasKeyDetailsChanged
            ? {
                memberConditions: Object.fromEntries(
                  Object.entries(state.medicalState.memberConditions).filter(([k]) => k !== id)
                ),
                completedMembers: Object.fromEntries(
                  Object.entries(state.medicalState.completedMembers).filter(([k]) => k !== id)
                ),
                hasDeclinedMember: state.medicalState.hasDeclinedMember,
              }
            : state.medicalState;

          return {
            members: state.members.map((m) => (m.id === id ? { ...m, ...member } : m)),
            medicalState: updatedMedicalState,
          };
        }),
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),
      setReferralCode: (code) => set({ referralCode: code }),
      setMedicalState: (state) => set({ medicalState: state }),
      clearMedicalState: () =>
        set({
          medicalState: {
            memberConditions: {},
            completedMembers: {},
            hasDeclinedMember: false,
          },
        }),
      setError: (field, message) =>
        set((state) => ({
          errors: { ...state.errors, [field]: message },
        })),
      clearError: (field) =>
        set((state) => {
          const { [field]: _, ...rest } = state.errors;
          return { errors: rest };
        }),
      reset: () => set(defaultState),
      saveOriginalState: () =>
        set((state) => ({
          originalState: {
            membershipType: state.membershipType,
            coverageType: state.coverageType,
            members: JSON.parse(JSON.stringify(state.members)),
          },
        })),
      clearOriginalState: () => set({ originalState: null }),
      hasStateChanged: () => {
        const state = get();
        if (!state.originalState) return true;

        return (
          state.originalState.membershipType !== state.membershipType ||
          state.originalState.coverageType !== state.coverageType ||
          JSON.stringify(state.originalState.members) !== JSON.stringify(state.members)
        );
      },
    }),
    persistConfig
  )
);
