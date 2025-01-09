'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTheme } from './theme-provider';

export function Logo() {
  const { theme } = useTheme();
  return (
    <Link href='/' className='flex w-fit items-center gap-2'>
      <Image
        src='/logo.png'
        width={180}
        height={100}
        priority
        style={{ height: 'auto', filter: theme === 'dark' ? 'invert(1)' : 'invert(0)' }}
        className='h-auto transition-[filter] duration-300 dark:invert'
        quality={100}
        alt='ASKETI logo mark'
      />
      {/* <span className='text-xl text-white'>ASKETI</span> */}
    </Link>
  );
}
