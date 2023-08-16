'use client'

import useFetchRestaurant from '@/app/hooks/useFetchRestaurant';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

interface RestaurantPageProps {
  params: {
    restaurant_id: string
  }
}

export default function RestaurantPage({ params: { restaurant_id } }: RestaurantPageProps) {
  const router = useRouter();
  
  const { restaurantData, fetchRestaurantData } = useFetchRestaurant(restaurant_id);

  useEffect(() => {
    if (restaurant_id) {
      fetchRestaurantData();
    }
  }, [restaurant_id, fetchRestaurantData]);

  useEffect(() => {
    if (restaurantData && restaurantData.root_category_id) {
      router.push(`/restaurant/${restaurant_id}/category/${restaurantData.root_category_id}`);
    }
  }, [restaurantData, restaurant_id, router]);

  return (
    <>
      Placeholder for full restaurant management.
    </>
  );
}
