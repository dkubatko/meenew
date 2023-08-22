import { Category as CategoryType, CategoryTree as CategoryTreeType, CategoryLite as CategoryLiteType, CategoryCreate, Category } from "@/app/types/category";

export default class CategoryAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async fetcher(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async get(restaurantId: string, categoryId: string): Promise<CategoryTreeType> {
    const options: RequestInit = {
      cache: 'no-store',
    }
  
    const data = await this.fetcher(`restaurant/${restaurantId}/category/${categoryId}`, options);
    return CategoryTreeType.fromObject(data);
  }

  public async get_raw(restaurantId: string, categoryId: string): Promise<any> {
    const options: RequestInit = {
      cache: 'no-store',
    }

    return await this.fetcher(`restaurant/${restaurantId}/category/${categoryId}`, options);
  }

  public async update(category: CategoryLiteType): Promise<CategoryLiteType> {
    const data = await this.fetcher('category', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return CategoryLiteType.fromObject(data);
  }

  public async create(category: CategoryCreate): Promise<Category> {
    const data = await this.fetcher('category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return Category.fromObject(data);
  }

}
