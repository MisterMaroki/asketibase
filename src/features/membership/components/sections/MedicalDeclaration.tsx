'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useMembershipStore } from '@/store/membership-store';

import { MedicalDisclaimer } from './medical/MedicalDisclaimer';
import { MedicalQuestionnaire } from './medical/MedicalQuestionnaire';
import { PreExistingConditions } from './medical/PreExistingConditions';
import { PreExistingDefinition } from './medical/PreExistingDefinition';

export function MedicalDeclaration() {
  const router = useRouter();
  const { setStep, members, medicalState, setMedicalState, clearMedicalState, saveOriginalState } =
    useMembershipStore();
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const { memberConditions, completedMembers, hasDeclinedMember } = medicalState;

  const isMemberScreeningComplete = (memberId: string) => {
    // Member has no pre-existing conditions (risk level 0)
    if (memberConditions[memberId] === false) {
      return true;
    }

    // Member has conditions and completed questionnaire with risk level 0 or 1
    if (memberConditions[memberId] === true) {
      const riskLevel = completedMembers[memberId];
      return riskLevel !== undefined && riskLevel < 2;
    }

    return false;
  };

  const allMembersScreeningComplete = members.every((member) => isMemberScreeningComplete(member.id));

  useEffect(() => {
    // clearMedicalState();
    setAcceptedDisclaimer(false);
    setShowQuestions(false);
  }, [clearMedicalState]);

  const handleMedicalComplete = (memberId: string, riskLevel: number) => {
    setMedicalState({
      ...medicalState,
      completedMembers: { ...medicalState.completedMembers, [memberId]: riskLevel },
      hasDeclinedMember: riskLevel === 2 ? true : medicalState.hasDeclinedMember,
    });
  };

  const handlePreExistingConditions = (memberId: string, hasConditions: boolean) => {
    const updatedCompletedMembers = { ...medicalState.completedMembers };

    // If hasConditions is false, set risk level to 0, otherwise remove the entry
    if (!hasConditions) {
      updatedCompletedMembers[memberId] = 0;
    } else {
      delete updatedCompletedMembers[memberId];
    }

    setMedicalState({
      ...medicalState,
      memberConditions: {
        ...medicalState.memberConditions,
        [memberId]: hasConditions,
      },
      completedMembers: updatedCompletedMembers,
      // Reset declined status if this was the member that caused it
      hasDeclinedMember: hasDeclinedMember && completedMembers[memberId] === 2 ? false : hasDeclinedMember,
    });
  };

  const allMembersAnswered = members.every((member) => memberConditions[member.id] !== undefined);

  const membersWithConditions = members.filter((member) => memberConditions[member.id] === true);

  const handleContinueToQuestions = () => {
    setShowQuestions(true);
  };

  const handleNext = () => {
    // setStep(5);
    router.replace('/membership?step=5');
  };

  return (
    <div className='space-y-6'>
      {!showQuestions ? (
        <div className='animate-fade-in space-y-6'>
          <MedicalDisclaimer />
          <div className='flex items-start space-x-2'>
            <Checkbox
              id='accept-disclaimer'
              checked={acceptedDisclaimer}
              onCheckedChange={(checked) => setAcceptedDisclaimer(checked as boolean)}
            />
            <label htmlFor='accept-disclaimer' className='cursor-pointer text-sm leading-relaxed'>
              I confirm that I have read and understood the medical declaration requirements and will provide accurate
              information for all members.
            </label>
          </div>
          <div className='flex justify-end space-x-4'>
            <Button onClick={handleContinueToQuestions} disabled={!acceptedDisclaimer} className='min-w-[200px]'>
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className='animate-slide-down space-y-8'>
          <div className='space-y-6'>
            <PreExistingDefinition />
            <div className='grid gap-6'>
              {members
                .filter((member) => completedMembers[member.id] === undefined)
                .map((member) => (
                  <PreExistingConditions
                    key={member.id}
                    memberId={member.id}
                    memberName={`${member.firstName} ${member.lastName}`}
                    hasConditions={memberConditions[member.id] ?? null}
                    onAnswer={handlePreExistingConditions}
                  />
                ))}
            </div>
          </div>

          {membersWithConditions.length > 0 && (
            <div className='space-y-8'>
              {membersWithConditions.map((member) => (
                <MedicalQuestionnaire
                  key={member.id}
                  memberId={member.id}
                  memberName={`${member.firstName} ${member.lastName}`}
                  onComplete={handleMedicalComplete}
                />
              ))}
            </div>
          )}

          {Object.entries(medicalState.completedMembers).length > 0 && (
            <Card className='space-y-4'>
              <CardHeader className='pb-1'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <CheckCircle className='h-5 w-5 text-primary' />
                  Screening Results
                </CardTitle>
              </CardHeader>
              <CardContent className='border-t pt-4'>
                {Object.entries(medicalState.completedMembers).map(([memberId, riskLevel]) => {
                  const member = members.find((member) => member.id === memberId);
                  if (!member) return null;
                  return (
                    <div key={memberId}>
                      <div
                        className={`flex items-center gap-2 ${
                          riskLevel === 0 ? 'text-green-500' : riskLevel === 1 ? 'text-yellow-500' : 'text-red-500'
                        }`}
                      >
                        <CheckCircle
                          className={`h-5 w-5 ${
                            riskLevel === 0 ? 'text-green-500' : riskLevel === 1 ? 'text-yellow-500' : 'text-red-500'
                          }`}
                        />
                        {member.firstName} {member.lastName} - Risk Level: {riskLevel}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <div className='flex justify-end space-x-4'>
            <Button
              onClick={handleNext}
              disabled={!allMembersAnswered || !allMembersScreeningComplete || hasDeclinedMember}
              className='min-w-[200px]'
            >
              {hasDeclinedMember ? 'Coverage Declined' : 'Continue to Quote'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
