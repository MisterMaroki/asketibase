'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { ActionResponse } from '@/types/action-response';

const titleMap = {
  login: 'Login to ASKETI',
} as const;

export function AuthUI({
  signInWithEmail,
}: {
  signInWithEmail: (email: string, password: string) => Promise<ActionResponse>;
}) {
  const [pending, setPending] = useState(false);

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.target as HTMLFormElement;
    const email = form['email'].value;
    const password = form['password'].value;
    const response = await signInWithEmail(email, password);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while authenticating. Please try again.',
      });
    } else {
      toast({
        description: `Signed in as ${email}`,
      });
    }

    form.reset();
    setPending(false);
  }

  return (
    <section className='mt-16 flex w-full flex-col gap-16 rounded-lg bg-black p-10 px-4 text-center'>
      <div className='flex flex-col gap-4'>
        <Image src='/logo.png' width={80} height={80} alt='' className='m-auto' />
        <h1 className='text-lg'>Login to ASKETI</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Lock className='h-5 w-5 text-primary' />
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className='space-y-4 text-left'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='Enter your email' aria-label='Enter your email' autoFocus />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' placeholder='Enter your password' aria-label='Enter your password' />
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <Button variant='secondary' type='submit' disabled={pending}>
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
