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
  login: 'Welcome Back',
  signup: 'Join ASKETI',
} as const;

const subtitleMap = {
  login: 'Sign in to your account',
  signup: 'Create your account',
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
    <div className='flex items-center justify-center'>
      <div className='w-full max-w-md'>
        {/* Decorative elements */}
        <div className='pointer-events-none absolute inset-0 overflow-hidden'>
          <div className='absolute left-1/4 top-1/4 h-32 w-32 animate-pulse rounded-full bg-emerald-400/10 blur-xl' />
          <div className='absolute bottom-1/4 right-1/4 h-24 w-24 animate-pulse rounded-full bg-emerald-300/10 blur-xl delay-1000' />
        </div>

        {/* Main card */}
        <div className='relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg'>
              <svg className='h-8 w-8 text-white' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z' />
              </svg>
            </div>
            <h1 className='mb-2 text-3xl font-bold text-white'>{titleMap[mode]}</h1>
            <p className='text-sm text-slate-400'>{subtitleMap[mode]}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div className='relative'>
                <Input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  aria-label='Enter your email'
                  autoFocus
                  className='h-12 w-full border-slate-600 bg-slate-900/50 px-4 text-white placeholder-slate-400 transition-all duration-200 focus:border-emerald-400 focus:ring-emerald-400/20'
                />
              </div>
              <div className='relative'>
                <Input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  aria-label='Enter your password'
                  className='h-12 w-full border-slate-600 bg-slate-900/50 px-4 text-white placeholder-slate-400 transition-all duration-200 focus:border-emerald-400 focus:ring-emerald-400/20'
                />
              </div>
            </div>

            <Button
              type='submit'
              disabled={pending}
              className='h-12 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {pending ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          {mode === 'signup' && (
            <div className='mt-8 border-t border-slate-700/50 pt-6'>
              <p className='text-center text-xs leading-relaxed text-slate-400'>
                By clicking continue, you agree to our{' '}
                <Link
                  href='https://www.asketi.com/terms-of-use'
                  className='text-emerald-400 underline underline-offset-2 transition-colors hover:text-emerald-300'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='https://www.asketi.com/privacy-policy'
                  className='text-emerald-400 underline underline-offset-2 transition-colors hover:text-emerald-300'
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        {/* Bottom text */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-slate-400'>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link
              href={mode === 'login' ? '/signup' : '/login'}
              className='font-medium text-emerald-400 transition-colors hover:text-emerald-300'
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
