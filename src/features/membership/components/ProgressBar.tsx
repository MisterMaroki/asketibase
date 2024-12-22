'use client';

import { useMemo } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = useMemo(() => {
    return Array.from({ length: totalSteps }, (_, i) => ({
      number: i + 1,
      completed: i + 1 < currentStep,
      current: i + 1 === currentStep,
    }));
  }, [currentStep, totalSteps]);

  return (
    <div className='w-full py-4'>
      <div className='relative flex justify-between'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex flex-col items-center'>
            <div
              className={cn('flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium', {
                'bg-primary text-primary-foreground': step.completed || step.current,
                'bg-muted text-muted-foreground': !step.completed && !step.current,
              })}
            >
              {step.completed ? <Check className='h-4 w-4' /> : step.number}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn('absolute top-4 -z-10 h-0.5', {
                  'bg-primary': step.completed,
                  'bg-muted': !step.completed,
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
