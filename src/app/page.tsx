import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meenew | Home',
  description: 'Welcome to Meenew!'
}

export default function Home() {
  return (
    <>
      <div className='list'>
        <Link className='link' href='/restaurant/0'>Restaurant management demo!</Link>
        <Link className='link' href='/menu/0'>Sample menu!</Link>
      </div>
    </>
  );
}