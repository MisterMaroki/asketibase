import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signInWithEmail, signInWithOAuth } from '@/app/(public)/(auth)/auth-actions';
import { AuthUI } from '@/app/(public)/(auth)/auth-ui';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, onSuccess, mode = 'login' }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAuthSuccess = () => {
    onClose();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-sm rounded-lg bg-card/50 p-0 text-white backdrop-blur-lg sm:max-w-md'>
        <AuthUI
          mode={mode}
          signInWithOAuth={async (provider) => {
            const result = await signInWithOAuth(provider);
            if (!result.error) {
              handleAuthSuccess();
            }
            return result;
          }}
          signInWithEmail={async (email) => {
            const result = await signInWithEmail(email);
            if (!result.error) {
              handleAuthSuccess();
            }
            return result;
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
