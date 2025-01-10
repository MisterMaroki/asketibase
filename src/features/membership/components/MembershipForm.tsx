'use client';

import { useEffect } from 'react';
import { ClipboardCheck, FileText, Lock, Shield, Stethoscope, UserCog, Users } from 'lucide-react';

import { useMembershipStore } from '@/store/membership-store';

import { EligibilitySection } from './sections/EligibilitySection';
import { MedicalDeclaration } from './sections/MedicalDeclaration';
import { MemberInformation } from './sections/MemberInformation';
import { MembershipDetails } from './sections/MembershipDetails';
import { Summary } from './sections/Summary';
import { StepIndicator } from './StepIndicator';

const steps = [
  { label: 'Eligibility', icon: <ClipboardCheck className='h-5 w-5' />, description: 'Check your eligibility' },
  { label: 'Details', icon: <UserCog className='h-5 w-5' />, description: 'Membership details' },
  { label: 'Members', icon: <Users className='h-5 w-5' />, description: 'Add members' },
  { label: 'Medical', icon: <Stethoscope className='h-5 w-5' />, description: 'Medical information' },
  { label: 'Summary', icon: <FileText className='h-5 w-5' />, description: 'Review and confirm' },
];

export function MembershipForm() {
  const { currentStep } = useMembershipStore((state) => state);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <main
      className='container relative mx-auto max-w-3xl px-4 pb-8 pt-2'
      role='main'
      aria-label='Membership Application Form'
    >
      {/* Progress Section */}
      <div className='mb-8'>
        {/* <h2 className='mb-2 text-2xl font-semibold'>Membership Application</h2> */}
        {/* <p className='mb-6 text-muted-foreground'>
          Please complete all sections of this form. Your information is secure and protected.
        </p> */}
        <StepIndicator
          currentStep={currentStep}
          steps={steps}
          aria-label={`Step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].label}`}
        />
      </div>

      {/* Trust Indicators */}
      <div className='mb-6 flex items-center gap-4 text-sm text-muted-foreground'>
        <div className='flex items-center gap-1'>
          <Lock className='h-4 w-4' />
          <span>SSL Secured</span>
        </div>
        <div className='flex items-center gap-1'>
          <Shield className='h-4 w-4' />
          <span>Your Data is Protected</span>
        </div>
      </div>

      {/* Form Content */}
      {/* <Card className='rounded-xl p-6 shadow-lg'> */}
      <div role='form' aria-label={`${steps[currentStep - 1].label} Section`}>
        {currentStep === 1 && <EligibilitySection />}
        {currentStep === 2 && <MembershipDetails />}
        {currentStep === 3 && <MemberInformation />}
        {currentStep === 4 && <MedicalDeclaration />}
        {currentStep === 5 && <Summary />}
      </div>
      {/* </Card> */}
    </main>
  );
}
