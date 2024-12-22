'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins, FileText, LayoutDashboard, LogOut, Receipt, Settings, Shield, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ActionResponse } from '@/types/action-response';
import { cn } from '@/utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Quotes', href: '/admin/quotes', icon: Receipt },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Pricing', href: '/admin/pricing', icon: Coins },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ signOut }: { signOut: () => Promise<ActionResponse> }) {
  const pathname = usePathname();
  return (
    <div className='flex w-64 flex-col border-r '>
      <div className='flex items-center gap-2 p-6 pl-2'>
        <Shield className='h-6 w-6 text-primary' />
        <span className='font-semibold'>Admin Portal</span>
      </div>

      <nav className='flex-1 pb-4 pl-1 pr-4'>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className='border-t p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start text-muted-foreground hover:text-destructive'
          onClick={signOut}
        >
          <LogOut className='mr-2 h-4 w-4' />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
