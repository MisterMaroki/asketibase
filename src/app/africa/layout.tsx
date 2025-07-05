import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Logo } from '@/components/logo';
import { ThemeProvider } from '@/components/theme-provider';
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
        <ThemeProvider>
          <Toaster />
          <div className='m-auto flex h-[95dvh] max-w-[1440px] flex-col px-2 md:px-4'>
            <AppBar />
            <div className='absolute inset-0' />
            <main className='relative flex-1'>
              <div className='relative h-full'>{children}</div>
              {/* Help Text */}
              <div className='flex-1 text-center text-sm text-muted-foreground'>
                <p className='pb-6'>
                  Need help? Contact our support team at <a href='mailto:support@asketi.com'>support@asketi.com</a>
                </p>
              </div>
            </main>
          </div>
          <Analytics />
          <Background />
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
      <Logo />
      <Navigation user={user} isAdmin={isAdmin} />
    </header>
  );
}
