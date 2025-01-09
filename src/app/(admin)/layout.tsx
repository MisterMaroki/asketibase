import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { cn } from '@/utils/cn';

import { signOut } from '../(public)/(auth)/auth-actions';

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

export default async function AdminRootLayout({ children }: PropsWithChildren) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: isAdmin } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  if (!isAdmin) {
    return redirect('/');
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.className)}>
        <ThemeProvider>
          <Toaster />
          <div className='flex flex-col px-2 md:px-4'>
            <main className='relative flex-1'>
              <Sidebar signOut={signOut} />
              <div className='relative h-full max-w-[1880px] pt-8 md:ml-64'>{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
