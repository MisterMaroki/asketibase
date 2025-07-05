import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Navigation } from '@/app/africa/navigation';
import { Logo } from '@/components/logo';
import { ThemeProvider } from '@/components/theme-provider';
import { Background } from '@/components/ui/background';
import { Toaster } from '@/components/ui/toaster';
import { checkAdmin } from '@/features/admin/check-admin';
import { getUser } from '@/features/membership/controllers/get-user';
import { cn } from '@/utils/cn';
import { Analytics } from '@vercel/analytics/react';

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
        <ThemeProvider>
          <Toaster />

          <div className='flex h-full w-full flex-col bg-gradient-to-br from-slate-900 via-black to-slate-800'>
            <AppBar />
            {children}
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

async function AppBar() {
  let user: any = null;
  let isAdmin: boolean = false;

  try {
    user = await getUser();
    isAdmin = await checkAdmin();
  } catch (error) {
    console.error('Failed to load user:', error);
  }

  return (
    <header className='z-50 flex items-center justify-between p-4 md:p-6'>
      <Navigation user={user} isAdmin={isAdmin} white />
    </header>
  );
}
