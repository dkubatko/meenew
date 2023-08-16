import Restaurant from '@/app/components/owner/restaurant.component';
import { ServerAPIClient } from '@/app/api/APIClient';

interface RestaurantPageProps {
  params: {
    restaurant_id: string,
    category_id: string
  }
}

export default async function RestaurantPage({ params: { restaurant_id, category_id } }: RestaurantPageProps) {
  const restaurant = await ServerAPIClient.Restaurant.get_raw(restaurant_id);
  const category = await ServerAPIClient.Category.get_raw(restaurant_id, category_id);

  return (
    <>
      <Restaurant restaurant={restaurant} category={category} />
    </>
  );
}

