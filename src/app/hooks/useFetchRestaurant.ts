import { useState, useCallback, useEffect } from 'react';
import RestaurantType from '@/app/types/restaurant';
import { ServerAPIClient } from '@/app/api/APIClient';

const useFetchRestaurant = (restaurantId: string) => {
  const [restaurantData, setRestaurantData] = useState<RestaurantType | null>(null);

  const fetchRestaurantData = useCallback(async () => {
    const restaurant = await ServerAPIClient.Restaurant.get(restaurantId);
    setRestaurantData(restaurant);
  }, [restaurantId]);

  // Initial fetch
  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  return { restaurantData, fetchRestaurantData };
};

export default useFetchRestaurant;