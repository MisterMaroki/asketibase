'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useAutoDarkMode() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark || hour >= 16 || hour < 6) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // Initial theme setting
    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);

    // Update theme every minute (to catch time-based changes)
    const interval = setInterval(updateTheme, 60000);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
      clearInterval(interval);
    };
  }, [setTheme]);
}