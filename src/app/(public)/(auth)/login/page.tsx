import { redirect } from 'next/navigation';

import { getSession } from '@/features/membership/controllers/get-session';

import { signInWithEmail, signInWithOAuth } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const returnUrl = params.returnUrl as string | undefined;

  return (
    <section className='py-xl m-auto flex h-full max-w-lg items-center'>
      <AuthUI signInWithEmail={signInWithEmail} signInWithOAuth={signInWithOAuth} mode='login' returnUrl={returnUrl} />
    </section>
  );
}
