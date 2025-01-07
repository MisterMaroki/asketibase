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
  const visualStep = currentStep <= 2 ? 1 : currentStep - 1;
  const progress = Math.min(((visualStep - 1) / 3) * 100, 100);

  return (
    <div className='relative mb-8'>
      <StepProgress progress={progress} />
      <div className='mx-auto flex max-w-3xl justify-between px-6'>
        {steps.map((step, index) => {
          if (index === 0) return null;

          const visualIndex = index - 1;
          const isCompleted = currentStep > index + 1;
          const isCurrent = index === 1 ? currentStep <= 2 : currentStep === index + 1;

          return (
            <div
              key={index}
              className='flex flex-col items-center'
              style={{
                animation: `fadeIn 0.5s ease-out ${visualIndex * 0.1}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              <div
                className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500', {
                  'scale-110 bg-primary text-primary-foreground': isCurrent,
                  'bg-muted text-muted-foreground': !isCurrent && !isCompleted,
                  'bg-primary text-primary-foreground': isCompleted,
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
                  'scale-105 font-semibold text-primary': isCurrent,
                  'text-muted-foreground': !isCurrent && !isCompleted,
                  'text-primary/80': isCompleted,
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
