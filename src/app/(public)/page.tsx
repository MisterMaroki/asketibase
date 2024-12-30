import Link from 'next/link';
import { Shield } from 'lucide-react';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  return (
    <div className='flex flex-col gap-8 lg:gap-32'>
      <HeroSection />
      {/* <Footer /> */}
    </div>
  );
}

function Footer() {
  return (
    <footer className='mt-8 flex flex-col gap-8 text-neutral-400 lg:mt-32'>
      <div className='flex flex-col justify-between gap-8 lg:flex-row'>
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

function HeroSection() {
  return (
    <section className='relative overflow-hidden lg:overflow-visible'>
      <Container className='relative rounded py-20 lg:py-[140px]'>
        <div className='relative z-10 items-center space-y-8 text-center'>
          <div className='mb flex w-full items-center justify-center gap-4'>
            {/* <Shield className='h-12 w-12 text-primary' /> */}
            <h1 className='text-5xl font-bold tracking-wider'>ASKETI</h1>
          </div>
          {/* <h2 className='bg-gradient-to-r from-primary/80 to-secondary bg-clip-text text-4xl font-bold  sm:text-5xl lg:text-6xl'>
            Global Travel Protection
          </h2> */}
          {/* <p className='mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground'>
            Premium international health coverage designed for modern global citizens. Experience world-class protection
            with ASKETI, anywhere you go.
          </p> */}

          <div className='mt-8'>
            <Link href='/membership'>
              <Button
                size='lg'
                variant='sexy'
                className='mx-auto shrink-0 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/100 hover:shadow-primary/25'
                // className='shrink-0 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/100 hover:shadow-primary/25'
              >
                Get Protected Now
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
