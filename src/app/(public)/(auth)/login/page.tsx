import { signInWithEmail } from '../auth-actions';
import { AuthUI } from '../auth-ui';

export default async function Login() {
  return (
    <section className='py-xl m-auto flex h-full max-w-lg items-center'>
      <AuthUI
        signInWithEmail={signInWithEmail}
        // signInWithOAuth={signInWithOAuth}
        mode='login'
      />
    </section>
  );
}
