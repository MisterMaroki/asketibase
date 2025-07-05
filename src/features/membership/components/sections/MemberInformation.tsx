'use client';

import { Button } from '@/components/ui/button';
import { MEMBER_LIMITS } from '@/constants';
import { isMemberValid } from '@/features/membership/validations/member';
import { useMembershipStore } from '@/store/membership-store';

import { MemberList } from './members/MemberList';
import { PrivacyDisclaimer } from './members/PrivacyDisclaimer';
import { SingleMemberForm } from './members/SingleMemberForm';

const RETURN_TO_SUMMARY_STEP = 5;

export function MemberInformation() {
  const { setStep, membershipType, members, hasStateChanged, clearOriginalState, originalState, medicalState } =
    useMembershipStore();

  const maxMembers = membershipType ? MEMBER_LIMITS[membershipType] : 1;
  const hasValidMemberCount =
    membershipType === 'INDIVIDUAL'
      ? members.length === 1
      : membershipType === 'COUPLE'
        ? members.length === 2
        : members.length >= 1 && members.length <= maxMembers;
  const allMembersComplete = members.every(isMemberValid);
  const canContinue = hasValidMemberCount && allMembersComplete;
  const allMembersScreeningComplete = members.every((member) => medicalState.completedMembers[member.id] !== undefined);

  const handleNext = () => {
    if ((originalState && !hasStateChanged()) || allMembersScreeningComplete) {
      clearOriginalState();
      // router.push(`/?step=${RETURN_TO_SUMMARY_STEP}`);
      setStep(RETURN_TO_SUMMARY_STEP);
    } else {
      clearOriginalState();
      // router.replace('/?step=4');
      setStep(4);
    }
  };

  const handlePrevious = () => {
    setStep(2);
    // router.replace('/?step=2');
  };

  return (
    <div className='space-y-6'>
      {membershipType === 'INDIVIDUAL' ? <SingleMemberForm /> : <MemberList />}

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
