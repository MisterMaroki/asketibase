import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getUser } from '@/features/membership/actions/get-user';
import { getProducts } from '@/features/pricing/controllers/get-products';
import { Price, ProductWithPrices } from '@/features/pricing/types';

export default async function AccountPage() {
  const [session, products] = await Promise.all([getUser(), getProducts()]);

  if (!session) {
    redirect('/login');
  }

  let userProduct: ProductWithPrices | undefined;
  let userPrice: Price | undefined;

  return (
    <section className='rounded-lg bg-black px-4 py-16'>
      <h1 className='mb-8 text-center'>Account</h1>

      {/* <div className='flex flex-col gap-4'>
        <Card
          title='Your Plan'
          footer={
            <Button size='sm' variant='secondary' asChild>
              <Link href='/pricing'>Start a subscription</Link>
            </Button>
          }
        ></Card>
      </div> */}
    </section>
  );
}

function Card({
  title,
  footer,
  children,
}: PropsWithChildren<{
  title: string;
  footer?: ReactNode;
}>) {
  return (
    <div className='m-auto w-full max-w-3xl rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-1 text-xl font-semibold'>{title}</h2>
        <div className='py-4'>{children}</div>
      </div>
      <div className='flex justify-end rounded-b-md border-t border-zinc-800 p-4'>{footer}</div>
    </div>
  );
}
