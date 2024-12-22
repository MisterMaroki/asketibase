import Link from 'next/link';
import { Shield } from 'lucide-react';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  return (
    <div className='flex flex-col gap-8 lg:gap-32'>
      <HeroSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className='relative overflow-hidden lg:overflow-visible'>
      <Container className='relative rounded py-20 lg:py-[140px]'>
        <div className='relative z-10 items-center space-y-8 text-center'>
          <div className='mb flex w-full items-center justify-center gap-4'>
            <Shield className='h-12 w-12 text-primary' />
            <h1 className='text-5xl font-bold tracking-wider'>ASKETI</h1>
          </div>
          <h2 className='bg-gradient-to-r from-primary/80 to-secondary bg-clip-text text-4xl font-bold  sm:text-5xl lg:text-6xl'>
            Global Health Protection
          </h2>
          <p className='mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground'>
            Premium international health coverage designed for modern global citizens. Experience world-class protection
            with ASKETI, anywhere you go.
          </p>

          <div className='mt-8'>
            <Link href='/membership'>
              <Button
                size='lg'
                variant='sexy'
                className='mx-auto shrink-0 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/100 hover:shadow-primary/25 '
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
