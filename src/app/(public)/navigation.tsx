'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoMenu } from 'react-icons/io5';

import { AccountMenu } from '@/components/account-menu';
import { Logo } from '@/components/logo';
import { ResetButton } from '@/components/reset';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { getUser } from '@/features/membership/controllers/get-user';

// import { signOut } from './(auth)/auth-actions';

export function Navigation() {
  const router = useRouter();

  return (
    <div className='relative flex items-center gap-6'>
      <ResetButton className='hidden md:flex' />
      <Button onClick={() => router.push('/admin')} variant='sexy' className='hidden flex-shrink-0 md:flex'>
        Admin
      </Button>
      <Sheet>
        <SheetTrigger className='block md:hidden'>
          <IoMenu size={28} />
        </SheetTrigger>
        <SheetContent className='w-full bg-black'>
          <SheetHeader>
            <Logo />
            <SheetDescription className='flex flex-col gap-2 py-8'>
              <Button variant='sexy' className='flex-shrink-0' onClick={() => router.push('/admin')}>
                Admin
              </Button>
              <ResetButton className='flex md:hidden' />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
