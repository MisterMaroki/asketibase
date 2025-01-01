import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Logo } from '@/components/logo';
import { Background } from '@/components/ui/background';
import { Toaster } from '@/components/ui/toaster';
import { checkAdmin } from '@/features/admin/check-admin';
import { getUser } from '@/features/membership/controllers/get-user';
import { cn } from '@/utils/cn';
import { Analytics } from '@vercel/analytics/react';

import { Navigation } from './navigation';

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

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.className)}>
        {/* <div className='flex h-full  bg-black/60 backdrop-blur-xl'> */}
        <Toaster />
        <div className='m-auto flex max-w-[1440px] flex-col px-2 md:px-4'>
          <AppBar />
          <div className='absolute inset-0 bg-black/40 backdrop-blur-xl' />
          <main className='relative flex-1'>
            <div className='relative h-full'>{children}</div>
          </main>
          {/* <Footer /> */}
        </div>
        {/* </div> */}
        <Analytics />
        <Background />
      </body>
    </html>
  );
}

async function AppBar() {
  const user = await getUser();
  const isAdmin = await checkAdmin();

  return (
    <header className='z-50 flex items-center justify-between p-4 md:p-6'>
      <Logo />
      <Navigation user={user} isAdmin={isAdmin} />
    </header>
  );
}
