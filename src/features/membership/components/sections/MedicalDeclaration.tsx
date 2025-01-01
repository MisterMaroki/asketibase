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
  const { memberConditions, completedMembers } = medicalState;

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
    // If we have any completed medical screenings, show the questions immediately
    if (Object.keys(memberConditions).length > 0) {
      setAcceptedDisclaimer(true);
      setShowQuestions(true);
    } else {
      setAcceptedDisclaimer(false);
      setShowQuestions(false);
    }
  }, [memberConditions]);

  const handleMedicalComplete = (memberId: string, riskLevel: number) => {
    setMedicalState({
      ...medicalState,
      completedMembers: { ...medicalState.completedMembers, [memberId]: riskLevel },
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
    });
  };

  const allMembersAnswered = members.every((member) => memberConditions[member.id] !== undefined);

  const membersWithConditions = members.filter((member) => memberConditions[member.id] === true);

  const handleContinueToQuestions = () => {
    setShowQuestions(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    router.replace('/membership?step=5');
  };

  const handlePrevious = () => {
    router.push('/membership?step=3');
  };

  const handleClearMember = (memberId: string) => {
    const newMedicalState = { ...medicalState };
    delete newMedicalState.memberConditions[memberId];
    delete newMedicalState.completedMembers[memberId];
    setMedicalState(newMedicalState);
  };

  return (
    <div className='space-y-6'>
      {!showQuestions ? (
        <div className='animate-fade-in space-y-6'>
          <MedicalDisclaimer />
          <div
            className={`flex items-start space-x-2 rounded-lg border bg-card/50 p-6 transition-all duration-200 ${
              acceptedDisclaimer ? 'border-secondary bg-secondary/5' : 'border-destructive/10'
            }`}
          >
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
            <Button variant='outline' onClick={handlePrevious}>
              Previous
            </Button>
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
              {members.map((member) => (
                <div key={member.id} className='space-y-4'>
                  <PreExistingConditions
                    key={member.id}
                    memberId={member.id}
                    memberName={`${member.firstName} ${member.lastName}`}
                    hasConditions={memberConditions[member.id] ?? null}
                    onAnswer={handlePreExistingConditions}
                  />
                  {memberConditions[member.id] !== undefined && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleClearMember(member.id)}
                      className='text-destructive hover:text-destructive/90'
                    >
                      Clear Response
                    </Button>
                  )}
                </div>
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
            <Button variant='outline' onClick={handlePrevious}>
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!allMembersAnswered || !allMembersScreeningComplete}
              className='min-w-[200px]'
            >
              {Object.values(medicalState.completedMembers).some((riskLevel) => riskLevel === 2)
                ? 'Coverage Declined'
                : 'Continue to Quote'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
