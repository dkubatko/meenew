import { useState, useCallback, useEffect } from 'react';
import { CategoryTree as CategoryTreeType } from '@/app/types/category';
import { ServerAPIClient } from '@/app/api/APIClient';

const useFetchCategory = (restaurantId: string, categoryId: string) => {
  const [categoryData, setCategoryData] = useState<CategoryTreeType | null>(null);

  const fetchCategoryData = useCallback(async () => {
    const category = await ServerAPIClient.Category.get(restaurantId, categoryId);
    setCategoryData(category);
  }, [restaurantId, categoryId]);

  // Initial fetch
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  return { categoryData, fetchCategoryData };
};

export default useFetchCategory;
