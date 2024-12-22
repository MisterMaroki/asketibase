'use client';

import { useEffect, useState } from 'react';

interface StepProgressProps {
  progress: number;
  color: string;
}

export function StepProgress({ progress, color }: StepProgressProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute top-5 left-0 right-0 h-0.5 -z-10">
      <div className="relative h-full w-full bg-[#758382]/20">
        <div
          className="absolute h-full transition-all duration-700 ease-out"
          style={{
            width: mounted ? `${progress}%` : '0%',
            background: `linear-gradient(90deg, ${color} 0%, ${color}aa 100%)`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}