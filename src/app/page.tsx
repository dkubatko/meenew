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
        <Link className='link' href='/menu/123'>Sample menu!</Link>
        <Link className='link' href='http://127.0.0.1:8000/api/python'>Try the Python integration!</Link>
      </div>
    </>
  );
}