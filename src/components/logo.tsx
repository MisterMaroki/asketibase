import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href='/' className='flex w-fit items-center gap-2'>
      {/* <Image src='/logo.png' width={40} height={40} priority quality={100} alt='ASKETI logo mark' /> */}
      <span className='text-xl text-white'>ASKETI</span>
    </Link>
  );
}
