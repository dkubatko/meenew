import Link from 'next/link';

export default function Test() {
  return (
    <div>
      <Link href='/menu/123'>Sample menu!</Link>
      <br/>
      <Link href='http://127.0.0.1:8000/api/python'>Try the Python integration!</Link>
    </div>
  );
}