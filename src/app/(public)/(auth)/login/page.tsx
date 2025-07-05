import { signInWithEmail } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function Login() {
  return (
    <section className='flex h-full w-full items-center justify-center'>
      <AuthUI
        signInWithEmail={signInWithEmail}
        // signInWithOAuth={signInWithOAuth}
        mode='login'
      />
    </section>
  );
}
