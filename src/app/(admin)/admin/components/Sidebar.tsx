'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Percent,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Enums } from '@/libs/supabase/types';
import { ActionResponse } from '@/types/action-response';
import { cn } from '@/utils/cn';
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';

import { ProjectFilter } from './ProjectFilter';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Memberships', href: '/admin/memberships', icon: FileText },
  { name: 'Quotes', href: '/admin/quotes', icon: Receipt },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Pricing', href: '/admin/pricing', icon: Coins },
  { name: 'Discount Codes', href: '/admin/discount-codes', icon: Percent },
  { name: 'Logs', href: '/admin/logs', icon: ScrollText },
  // { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  signOut: () => Promise<ActionResponse>;
  availableProjects?: Enums<'project_code'>[];
  isSuper?: boolean;
}

function SidebarContent({ signOut, availableProjects = [], isSuper = false }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper function to create navigation URL with preserved search params
  const createNavUrl = (href: string) => {
    const params = new URLSearchParams(searchParams);
    const queryString = params.toString();
    return queryString ? `${href}?${queryString}` : href;
  };

  return (
    <div className='flex h-[100dvh] flex-col pt-2'>
      <div className='flex items-center gap-2 p-6 pl-4'>
        <Logo />
        <ThemeToggle />
      </div>

      {/* Project Filter */}
      <ProjectFilter availableProjects={availableProjects} isSuper={isSuper} />

      <nav className='flex-1 py-4 pl-1 pr-4'>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={createNavUrl(item.href)}
              className={cn(
                'mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className='border-t p-4'>
        <Link href='/'>
          <Button variant='ghost' className='w-full justify-start text-muted-foreground hover:text-destructive'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to form
          </Button>
        </Link>

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

export function Sidebar({ signOut, availableProjects = [], isSuper = false }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div className='fixed hidden flex-col border-r md:flex md:h-full md:w-64'>
        <SidebarContent signOut={signOut} availableProjects={availableProjects} isSuper={isSuper} />
      </div>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild className='fixed -left-2 top-20 z-50 md:hidden'>
          <div className='flex items-center gap-2 rounded-r-md border border-primary p-2'>
            <DoubleArrowRightIcon className='h-5 w-5' />
            {/* <p className=' '>Hi</p> */}
          </div>
        </SheetTrigger>
        <SheetContent side='left' className='w-64 p-0' aria-describedby='Admin Sidebar'>
          <SheetTitle />
          <SidebarContent signOut={signOut} availableProjects={availableProjects} isSuper={isSuper} />
        </SheetContent>
      </Sheet>
    </>
  );
}
