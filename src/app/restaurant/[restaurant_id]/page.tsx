import { ServerAPIClient } from '@/app/api/APIClient';
import Restaurant from '@/app/components/owner/restaurant.component';

interface RestaurantPageProps {
  params: {
    restaurant_id: string
  }
}

export default async function RestaurantPage({ params: { restaurant_id } }: RestaurantPageProps) {
  const restaurant = await ServerAPIClient.Restaurant.get_raw(restaurant_id);
  const category = await ServerAPIClient.Category.get_raw(restaurant_id, restaurant.root_category_id.toString());

  return (
    <>
      <Restaurant restaurant={restaurant} category={category} />
    </>
  );
}
