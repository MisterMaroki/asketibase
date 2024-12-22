import { signInWithEmail } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function LoginPage() {
  return (
    <section className='py-xl m-auto flex h-full max-w-lg items-center'>
      <AuthUI signInWithEmail={signInWithEmail} />
    </section>
  );
}
