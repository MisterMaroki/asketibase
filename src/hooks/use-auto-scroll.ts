'use client';

import { useEffect, useRef } from 'react';

export function useAutoScroll<T extends HTMLElement>(deps: any[]) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    // Wait for next frame to ensure DOM is updated
    requestAnimationFrame(() => {
      const element = elementRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const isPartiallyVisible = rect.bottom > window.innerHeight;

        if (isPartiallyVisible) {
          const scrollTarget = window.scrollY + rect.bottom - window.innerHeight + 100; // Increased padding

          // Ensure we don't scroll past the document height
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const finalScroll = Math.min(scrollTarget, maxScroll);

          window.scrollTo({
            top: finalScroll,
            behavior: 'smooth',
          });
        }
      }
    });
  }, deps);

  return elementRef;
}
