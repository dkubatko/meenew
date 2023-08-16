import { CategoryTree as CategoryTreeType } from "@/app/types/category";

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
    const data = await this.fetcher(`restaurant/${restaurantId}/category/${categoryId}`);
    return CategoryTreeType.fromObject(data);
  }

  public async get_raw(restaurantId: string, categoryId: string): Promise<any> {
    return await this.fetcher(`restaurant/${restaurantId}/category/${categoryId}`);
  }
}
