import { useState, useCallback, useEffect } from 'react';
import { Restaurant as RestaurantType } from '@/app/types/menu';
import { ServerAPIClient } from '@/app/api/APIClient';

const useFetchRestaurant = (restaurantId: string) => {
  const [restaurantData, setRestaurantData] = useState<RestaurantType | null>(null);

  const fetchRestaurant = useCallback(async () => {
    const restaurant = await ServerAPIClient.getRestaurant(restaurantId);
    setRestaurantData(restaurant);
  }, [restaurantId]);

  // Initial fetch
  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  return { restaurantData, fetchRestaurant };
};

export default useFetchRestaurant;