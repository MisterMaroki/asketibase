import Link from 'next/link';
import { IoMenu } from 'react-icons/io5';

import { AccountMenu } from '@/components/account-menu';
import { Logo } from '@/components/logo';
import { ResetButton } from '@/components/reset';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { getUser } from '@/features/membership/controllers/get-user';

import { signOut } from './(auth)/auth-actions';

export async function Navigation() {
  const session = await getUser();

  return (
    <div className='relative flex items-center gap-6'>
      <ResetButton />
      {session ? (
        <AccountMenu signOut={signOut} />
      ) : (
        <>
          <Button variant='sexy' className='hidden flex-shrink-0 lg:flex' asChild>
            <Link href='/signup'>Admin</Link>
          </Button>
          <Sheet>
            <SheetTrigger className='block lg:hidden'>
              <IoMenu size={28} />
            </SheetTrigger>
            <SheetContent className='w-full bg-black'>
              <SheetHeader>
                <Logo />
                <SheetDescription className='py-8'>
                  <Button variant='sexy' className='flex-shrink-0' asChild>
                    <Link href='/signup'>Admin</Link>
                  </Button>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
