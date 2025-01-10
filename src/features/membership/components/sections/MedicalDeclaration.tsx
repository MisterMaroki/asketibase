'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useMembershipStore } from '@/store/membership-store';
import { cn } from '@/utils/cn';

import { MedicalDisclaimer } from './medical/MedicalDisclaimer';
import { MedicalQuestionnaire } from './medical/MedicalQuestionnaire';
import { PreExistingDefinition } from './medical/PreExistingDefinition';

export function MedicalDeclaration() {
  const router = useRouter();
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const { members, medicalState, setMedicalState, setStep } = useMembershipStore();

  const handleMedicalComplete = (memberId: string, riskLevel: number) => {
    if (riskLevel === -1) {
      const newState = { ...medicalState };
      delete newState.completedMembers[memberId];
      setMedicalState(newState);
      return;
    }

    setMedicalState({
      ...medicalState,
      completedMembers: { ...medicalState.completedMembers, [memberId]: riskLevel },
    });
  };

  const allMembersScreeningComplete = members.every((member) => {
    const riskLevel = medicalState.completedMembers[member.id];
    return riskLevel !== undefined;
  });

  const hasDeclinedMembers = Object.values(medicalState.completedMembers).some((riskLevel) => riskLevel === 2);

  const handleNext = () => {
    // router.replace('/?step=5');
    setStep(5);
  };

  const handlePrevious = () => {
    // router.push('/?step=3');
    setStep(3);
  };

  return (
    <div className='space-y-8'>
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
              <Button onClick={() => setShowQuestions(true)} disabled={!acceptedDisclaimer} className='min-w-[200px]'>
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className='animate-fade-in space-y-6'>
            <PreExistingDefinition />

            {/* Medical Questionnaires */}
            <div className='space-y-6'>
              {members.map((member) => (
                <MedicalQuestionnaire
                  key={member.id}
                  memberId={member.id}
                  memberName={`${member.firstName} ${member.lastName}`}
                  onComplete={handleMedicalComplete}
                />
              ))}
            </div>

            {/* Summary Card - Only show when at least one member is complete */}
            {Object.keys(medicalState.completedMembers).length > 0 && (
              <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <CheckCircle className='h-5 w-5 text-primary' />
                    Screening Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {members.map((member) => {
                    const riskLevel = medicalState.completedMembers[member.id];
                    console.log('🚀 ~ {members.map ~ riskLevel:', riskLevel, member.id);
                    if (riskLevel === undefined) return null;

                    return (
                      <div
                        key={member.id}
                        className={cn(
                          'flex items-center justify-between rounded-lg p-3',
                          riskLevel === 0
                            ? 'bg-primary/10 text-primary'
                            : riskLevel === 1
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-destructive/10 text-destructive',
                        )}
                      >
                        <div className='flex items-center gap-2'>
                          {riskLevel === 2 ? (
                            <AlertTriangle className='h-4 w-4' />
                          ) : (
                            <CheckCircle className='h-4 w-4' />
                          )}
                          <span>
                            {member.firstName} {member.lastName}
                          </span>
                        </div>
                        <div className='font-medium'>
                          {riskLevel === 0
                            ? 'Standard Coverage'
                            : riskLevel === 1
                              ? 'Premium Added'
                              : 'Coverage Declined'}
                        </div>
                      </div>
                    );
                  })}
                  {hasDeclinedMembers && (
                    <div className='mt-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive'>
                      <p className='font-medium'>Coverage has been declined for one or more members</p>
                      <p className='mt-1'>
                        You must clear their responses and complete the medical screening again to proceed with the
                        application.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className='flex justify-end space-x-4'>
              <Button variant='outline' onClick={handlePrevious}>
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!allMembersScreeningComplete || hasDeclinedMembers}
                className='min-w-[200px]'
              >
                Continue to Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
