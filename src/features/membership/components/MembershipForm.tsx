'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ClipboardCheck, FileText, Stethoscope, UserCog, Users } from 'lucide-react';

import { useMembershipStore } from '@/store/membership-store';

import { EligibilitySection } from './sections/EligibilitySection';
import { MedicalDeclaration } from './sections/MedicalDeclaration';
import { MemberInformation } from './sections/MemberInformation';
import { MembershipDetails } from './sections/MembershipDetails';
import { Summary } from './sections/Summary';
import { StepIndicator } from './StepIndicator';

const steps = [
  { label: 'Eligibility', icon: <ClipboardCheck className='h-5 w-5' /> },
  { label: 'Details', icon: <UserCog className='h-5 w-5' /> },
  { label: 'Members', icon: <Users className='h-5 w-5' /> },
  { label: 'Medical', icon: <Stethoscope className='h-5 w-5' /> },
  { label: 'Summary', icon: <FileText className='h-5 w-5' /> },
];

export function MembershipForm() {
  const searchParams = useSearchParams();

  const { currentStep, setStep } = useMembershipStore((state) => state);

  useEffect(() => {
    const step = searchParams.get('step');
    if (step) {
      setStep(parseInt(step, 10));
    }
  }, [searchParams, setStep]);

  return (
    <div className='container relative mx-auto max-w-3xl px-4 py-8'>
      <StepIndicator currentStep={currentStep} steps={steps} />

      <div className='rounded-xl bg-card/30 p-6 shadow-lg backdrop-blur-sm'>
        {currentStep === 1 && <EligibilitySection />}
        {currentStep === 2 && <MembershipDetails />}
        {currentStep === 3 && <MemberInformation />}
        {currentStep === 4 && <MedicalDeclaration />}
        {currentStep === 5 && <Summary />}
      </div>
    </div>
  );
}
