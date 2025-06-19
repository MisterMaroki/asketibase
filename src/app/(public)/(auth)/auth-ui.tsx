'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ActionResponse } from '@/types/action-response';

import { signInWithEmailAndPassword } from './auth-actions';

const titleMap = {
  login: 'Login to ASKETI',
  signup: 'Join ASKETI',
} as const;

export function AuthUI({
  mode,
  // signInWithOAuth,
  signInWithEmail,
}: {
  mode: 'login' | 'signup';
  // signInWithOAuth: (provider: 'apple' | 'google') => Promise<ActionResponse>;
  signInWithEmail: (email: string) => Promise<ActionResponse>;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.target as HTMLFormElement;
    const email = form['email'].value;
    const password = form['password'].value;
    const response = await signInWithEmailAndPassword(email, password);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while authenticating. Please try again.',
      });
    } else {
      router.push('/admin');
    }

    form.reset();
    setPending(false);
  }

  return (
    <section className='mt-16 flex w-full flex-col rounded-lg p-10 px-4 text-center'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl text-black dark:text-white'>{titleMap[mode]}</h1>
      </div>
      {/* <button
          className='flex items-center justify-center gap-2 rounded-md bg-blue-500 py-4 font-medium text-white transition-all hover:bg-blue-400 disabled:bg-neutral-700'
          onClick={() => handleOAuthClick('google')}
          disabled={pending}
        >
          <IoLogoGoogle size={20} />j
          Continue with Google
        </button> */}
      {/* 
        <button
          className='flex items-center justify-center gap-2 rounded-md bg-black py-4 font-medium text-white transition-all hover:bg-gray-700 disabled:bg-neutral-700'
          onClick={() => handleOAuthClick('apple')}
          disabled={pending}
        >
          <IoLogoApple size={20} />
          Continue with Apple
        </button> */}

      <form onSubmit={handleEmailSubmit}>
        <div className='flex w-full flex-col gap-4 p-8'>
          <Input type='email' name='email' placeholder='Enter your email' aria-label='Enter your email' autoFocus />
          <Input type='password' name='password' placeholder='Enter your password' aria-label='Enter your password' />
          <div className='mt-4 flex justify-end gap-2'>
            <Button variant='secondary' type='submit' disabled={pending}>
              Submit
            </Button>
          </div>
        </div>
      </form>
      {mode === 'signup' && (
        <span className='text-neutral5 m-auto max-w-sm text-sm'>
          By clicking continue, you agree to our{' '}
          <Link href='https://www.asketi.com/terms-of-use' className='underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='https://www.asketi.com/privacy-policy' className='underline'>
            Privacy Policy
          </Link>
          .
        </span>
      )}
    </section>
  );
}
