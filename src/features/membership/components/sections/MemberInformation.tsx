'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MEMBER_LIMITS } from '@/constants/membership';
import { isMemberValid } from '@/features/membership/validations/member-fields';
import { useMembershipStore } from '@/store/membership-store';

import { MultiMemberManager } from './members/MultiMemberManager';
import { PrivacyDisclaimer } from './members/PrivacyDisclaimer';
import { SingleMemberForm } from './members/SingleMemberForm';

const RETURN_TO_SUMMARY_STEP = 5;

export function MemberInformation() {
  const router = useRouter();
  const { setStep, membershipType, members, hasStateChanged, clearOriginalState, originalState, medicalState } =
    useMembershipStore();

  const maxMembers = membershipType ? MEMBER_LIMITS[membershipType] : 1;
  const hasValidMemberCount =
    membershipType === 'INDIVIDUAL' ? members.length === 1 : members.length >= 1 && members.length <= maxMembers;
  const allMembersComplete = members.every(isMemberValid);
  const canContinue = hasValidMemberCount && allMembersComplete;
  const allMembersScreeningComplete = members.every((member) => medicalState.completedMembers[member.id] !== undefined);
  const getMemberRequirementMessage = () => {
    if (!hasValidMemberCount) {
      if (membershipType === 'INDIVIDUAL' && members.length > 1) {
        return 'Individual plans can only have one member';
      }
      if (members.length > maxMembers) {
        return `Maximum ${maxMembers} members allowed for this plan`;
      }
      if (members.length === 0) {
        return 'Please add at least one member to continue';
      }
    }
    if (!allMembersComplete) {
      return 'Please complete all required fields for each member';
    }
    return null;
  };

  const handleNext = () => {
    if ((originalState && !hasStateChanged()) || allMembersScreeningComplete) {
      clearOriginalState();
      // setStep(RETURN_TO_SUMMARY_STEP);
      router.push(`/membership?step=${RETURN_TO_SUMMARY_STEP}`);
    } else {
      clearOriginalState();
      // setStep(4);
      router.replace('/membership?step=4');
    }
  };

  const handlePrevious = () => {
    setStep(2);
    router.replace('/membership?step=2');
  };

  return (
    <div className='space-y-6'>
      {membershipType === 'INDIVIDUAL' ? <SingleMemberForm /> : <MultiMemberManager />}

      {!canContinue && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{getMemberRequirementMessage()}</AlertDescription>
        </Alert>
      )}

      <PrivacyDisclaimer />

      <div className='flex justify-end space-x-4'>
        <Button variant='outline' onClick={handlePrevious}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!canContinue} className='min-w-[200px]'>
          {(originalState && !hasStateChanged()) || allMembersScreeningComplete
            ? 'Continue to Summary'
            : 'Continue to Medical Declaration'}
        </Button>
      </div>
    </div>
  );
}