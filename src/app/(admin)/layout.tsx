import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/utils/cn';

import { signOut } from '../(auth)/auth-actions';

import { Sidebar } from './admin/components/Sidebar';

import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
});

export const viewport: Viewport = {
  viewportFit: 'cover',
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'ASKETI Global Travel Protection',
  description: 'Global travel protection for modern global citizens',
};

export default function AdminRootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.className)}>
        <Toaster />
        <div className='m-auto flex max-w-[1440px] flex-col px-2 md:px-4'>
          <main className='relative flex-1'>
            <Sidebar signOut={signOut} />
            <div className='relative h-full pt-16 md:ml-64 md:pt-10'>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
