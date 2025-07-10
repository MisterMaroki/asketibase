'use client';

import { useRouter } from 'next/navigation';

import { ResetButton } from '@/components/reset';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Tables } from '@/libs/supabase/types';

// import { signOut } from './(auth)/auth-actions';

interface NavigationProps {
  user: Tables<'users'> | null;
  isAdmin: boolean;
  white?: boolean;
}

export function Navigation({ user, isAdmin, white = false }: NavigationProps) {
  const router = useRouter();

  return (
    <div className='relative flex items-center gap-6'>
      <ThemeToggle />
      {/* <ResetButton className='hidden md:flex' /> */}
      {isAdmin && (
        <>
          <Button onClick={() => router.push('/admin')} variant='sexy' className='hidden flex-shrink-0 md:flex'>
            Admin
          </Button>
          <ResetButton />
        </>
      )}
      {/* {!!user ? (
        <Button onClick={() => signOut()} variant='sexy' className='hidden flex-shrink-0 md:flex'>
          Sign Out
        </Button>
      ) : (
        <Button onClick={() => router.push('/login')} variant='sexy' className='hidden flex-shrink-0 md:flex'>
          Sign In
        </Button>
      )} */}
      {/* <Sheet>
        <SheetTrigger className='block md:hidden'>
          <IoMenu size={28} />
        </SheetTrigger>
        <SheetContent className='w-full bg-black'>
          <SheetHeader>
            <Logo />
            <SheetDescription className='flex flex-col gap-2 py-8'>
              {isAdmin && (
                <Button variant='sexy' className='flex-shrink-0' onClick={() => router.push('/admin')}>
                  Admin
                </Button>
              )}
              {!!user ? (
                <Button variant='sexy' className='flex-shrink-0' onClick={() => signOut()}>
                  Sign Out
                </Button>
              ) : (
                <Button variant='sexy' className='flex-shrink-0' onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              )}
              <ResetButton className='flex md:hidden' />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet> */}
    </div>
  );
}
