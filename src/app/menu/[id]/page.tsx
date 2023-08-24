import Questionnaire from '@/app/components/user/questionnaire.component';
import { ServerAPIClient } from '@/app/api/APIClient';
import { Metadata } from 'next';

interface MenuProps {
  params: {
    restaurant_id: string
  }
}

export const metadata: Metadata = {
  title: 'Meenew | Questionnaire',
  description: 'Find your best match.'
}

export default async function Menu({ params: { restaurant_id } }: MenuProps) {
  const categoryTree = await ServerAPIClient.Restaurant.get_raw_category_tree(restaurant_id);

  return (
    <Questionnaire
      categoryTree={categoryTree}
    />
  );
}