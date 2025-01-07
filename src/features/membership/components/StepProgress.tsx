'use client';

import { useEffect, useState } from 'react';

interface StepProgressProps {
  progress: number;
}

export function StepProgress({ progress }: StepProgressProps) {
  const [mounted, setMounted] = useState(false);

  const progressToShow = progress === 0 ? 8 : progress;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='absolute left-0 right-0 top-5 z-0 h-0.5'>
      <div className='relative h-full w-full bg-[#758382]/20'>
        <div
          className='absolute h-full transition-all duration-700 ease-out'
          style={{
            width: mounted ? `${progressToShow}%` : '0%',
            background: `linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)`,
            boxShadow: `0 0 8px hsl(var(--primary) / 0.4)`,
          }}
        />
      </div>
    </div>
  );
}
