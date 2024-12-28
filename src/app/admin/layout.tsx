import { signOut } from '@/app/(auth)/auth-actions';
import { Toaster } from '@/components/ui/toaster';

import { Sidebar } from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-full'>
      <Toaster />
      <Sidebar signOut={signOut} />
      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  );
}
