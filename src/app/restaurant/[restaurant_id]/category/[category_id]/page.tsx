'use client'

import Restaurant from '@/app/components/owner/restaurant.component';

interface RestaurantPageProps {
  params: {
    restaurant_id: string,
    category_id: string
  }
}

export default function RestaurantPage({ params: { restaurant_id, category_id } }: RestaurantPageProps) {
  return (
    <>
      <Restaurant restaurant_id={restaurant_id} category_id={category_id} />
    </>
  );
}

