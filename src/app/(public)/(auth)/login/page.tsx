import { redirect } from 'next/navigation';

import { getSession } from '@/features/membership/controllers/get-session';

import { signInWithEmail, signInWithEmailAndPassword, signInWithOAuth } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function LoginPage() {
  // const session = await getSession();
  // const isAdmin = session?.user.role === 'admin';

  // if (isAdmin) {
  //   redirect('/admin');
  // }

  // if (session) {
  //   redirect('/membership');
  // }

  return (
    <section className='py-xl m-auto flex h-full max-w-lg items-center'>
      <AuthUI signInWithEmail={signInWithEmail} signInWithOAuth={signInWithOAuth} mode='login' />
    </section>
  );
}
