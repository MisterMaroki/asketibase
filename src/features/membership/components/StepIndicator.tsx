'use client';

import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

import { StepProgress } from './StepProgress';

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{
    label: string;
    icon: React.ReactNode;
  }>;
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className='relative mb-8'>
      <StepProgress progress={progress} color='#9ef0e4' />
      <div className='mx-auto flex max-w-3xl justify-between px-6'>
        {steps.map((step, index) => {
          const isEligibility = index === 0;

          if (isEligibility) {
            return null;
          }

          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;

          return (
            <div
              key={index}
              className='flex flex-col items-center'
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              <div
                className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500', {
                  'scale-110 bg-[#9ef0e4] text-gray-900': isCurrent,
                  'bg-[#72c4ac] text-white': isCompleted,
                  'bg-[#758382]/20 text-gray-600': !isCompleted && !isCurrent,
                  'ring-4 ring-[#9ef0e4]/30': isCurrent,
                })}
              >
                {isCompleted ? (
                  <Check className='animate-scale-in h-5 w-5' />
                ) : (
                  <div className='animate-fade-in'>{step.icon}</div>
                )}
              </div>
              <span
                className={cn('mt-2 text-xs font-medium transition-colors duration-300', {
                  'scale-105 text-[#72c4ac]': isCurrent,
                  'text-gray-900': isCompleted,
                  'text-gray-500': !isCompleted && !isCurrent,
                })}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
