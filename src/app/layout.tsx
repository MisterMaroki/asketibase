import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Logo } from '@/components/logo';
import { Background } from '@/components/ui/background';
import { Toaster } from '@/components/ui/toaster';
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
        <div className='m-auto flex max-w-[1440px] flex-col px-2 md:px-4'>
          <AppBar />
          <div className='absolute inset-0 bg-black/40 backdrop-blur-xl' />
          <main className='relative flex-1'>
            <div className='relative h-full '>{children}</div>
          </main>
          {/* <Footer /> */}
        </div>
        {/* </div> */}
        <Toaster />
        <Analytics />
        <Background />
      </body>
    </html>
  );
}

async function AppBar() {
  return (
    <header className='z-50 flex items-center justify-between p-4 md:p-6'>
      <Logo />
      <Navigation />
    </header>
  );
}

function Footer() {
  return (
    <footer className='mt-8 flex flex-col gap-8 text-neutral-400 lg:mt-32'>
      <div className='flex flex-col justify-between gap-8 lg:flex-row'>
        <div>
          <Logo />
        </div>
        {/* <div className='grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4 lg:gap-16'>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Product</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/pricing'>Pricing</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Company</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/about-us'>About Us</Link>
              <Link href='/privacy'>Privacy</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Support</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/support'>Get Support</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Follow us</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='#'>
                <span className='flex items-center gap-2'>
                  <IoLogoTwitter size={22} /> <span>Twitter</span>
                </span>
              </Link>
              <Link href='#'>
                <span className='flex items-center gap-2'>
                  <IoLogoFacebook size={22} /> <span>Facebook</span>
                </span>
              </Link>
              <Link href='#'>
                <span className='flex items-center gap-2'>
                  <IoLogoInstagram size={22} /> <span>Instagram</span>
                </span>
              </Link>
            </nav>
          </div>
        </div> */}
      </div>
      <div className='border-t border-zinc-800 py-6 text-center'>
        <span className='text-neutral4 text-xs'>Copyright {new Date().getFullYear()} © ASKETI</span>
      </div>
    </footer>
  );
}
