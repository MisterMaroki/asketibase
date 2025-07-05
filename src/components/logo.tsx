'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTheme } from './theme-provider';

export function Logo({
  white = false,
  height = 100,
  width = 180,
}: {
  white?: boolean;
  height?: number;
  width?: number;
}) {
  const { theme } = useTheme();
  return (
    <Link
      href='/'
      className='flex w-fit items-center gap-2'
      style={{
        height,
        width,
      }}
    >
      <Image
        src='/logo.png'
        width={width}
        height={height}
        priority
        style={{ height: 'auto', filter: theme === 'dark' || white ? 'invert(1)' : 'invert(0)' }}
        className='h-auto transition-[filter] duration-300 dark:invert'
        quality={100}
        alt='ASKETI logo mark'
      />
    </Link>
  );
}
