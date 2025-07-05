import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { getAdminProjectAccess } from '@/features/admin/get-admin-project-access';
import { createSupabaseServerClient } from '@/libs/supabase/server-client';
import { cn } from '@/utils/cn';

import { signOut } from '../(public)/(auth)/auth-actions';

import { Sidebar } from './admin/components/Sidebar';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard | ASKETI',
  description: 'ASKETI Admin Dashboard',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

  // Get admin project access
  const projectAccess = await getAdminProjectAccess();

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.className)}>
        <ThemeProvider>
          <Toaster />
          <div className='flex flex-col px-2 md:px-4'>
            <main className='relative flex-1'>
              <Sidebar
                signOut={signOut}
                availableProjects={projectAccess?.projects || []}
                isSuper={projectAccess?.isSuper || false}
              />
              <div className='relative h-full max-w-[1880px] pt-8 md:ml-64'>{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
