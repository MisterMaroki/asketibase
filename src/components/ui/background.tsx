'use client';
// import { scan } from 'react-scan'; // import this BEFORE react

// import { getURL } from '@/utils/get-url';

// // import React from 'react';
// if (typeof window !== 'undefined') {
//   scan({
//     enabled: getURL().includes('localhost'),
//     // log: true, // logs render info to console (default: false)
//   });
// }
export function Background() {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden'>
      <div className='absolute inset-0 bg-black/90' />

      {/* Primary gradient orb */}
      <div
        className='animate-float absolute -right-40 -top-40 h-96 w-96 rounded-full'
        style={{
          background: 'radial-gradient(circle, hsl(171, 76%, 75%, 0.15), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Secondary gradient orb */}
      <div
        className='animate-float-delayed absolute -bottom-20 -left-20 h-80 w-80 rounded-full'
        style={{
          background: 'radial-gradient(circle, hsl(165, 42%, 61%, 0.15), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Accent gradient orb */}
      <div
        className='animate-float absolute left-1/4 top-1/2 h-64 w-64 rounded-full'
        style={{
          background: 'radial-gradient(circle, hsl(197, 3%, 51%, 0.1), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
