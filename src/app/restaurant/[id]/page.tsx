import Restaurant from "@/app/components/owner/restaurant.component";
import { Metadata } from "next";
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Meenew | Restaurant',
  description: 'Manage your restaurant.'
}

export default async function RestaurantPage() {
  return (
    <>
      <Head>
        <title>HELLO</title>
        <meta name='description' content='I hope this tutorial is helpful for you' />
      </Head>
      <Restaurant />
    </>
  )
}