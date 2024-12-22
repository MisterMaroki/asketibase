'use client';

import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const steps = [
    { number: 1, label: 'Eligibility' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Members' },
    { number: 4, label: 'Summary' },
  ];

  return (
    <div className='w-full'>
      <div className='relative flex justify-between'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex flex-1 flex-col items-center'>
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200',
                {
                  'bg-primary text-primary-foreground': step.number <= currentStep,
                  'bg-muted text-muted-foreground': step.number > currentStep,
                }
              )}
            >
              {step.number < currentStep ? <Check className='h-5 w-5' /> : step.number}
            </div>
            <span className='mt-2 text-xs font-medium text-gray-600 dark:text-gray-400 sm:text-sm'>{step.label}</span>
            {index < steps.length - 1 && (
              <div
                className={cn('absolute top-5 -z-10 h-0.5 transition-colors duration-200', {
                  'bg-primary': step.number < currentStep,
                  'bg-muted': step.number >= currentStep,
                })}
                style={{
                  left: `${(index * 100) / (steps.length - 1)}%`,
                  width: `${100 / (steps.length - 1)}%`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
