import RestaurantType from "@/app/types/restaurant";
import { Question } from "@/app/types/questionnaire";
import { Tag } from "@/app/types/tag";
import MenuItem from "@/app/types/menuItem";

export default class RestaurantAPI {
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

  public async get(id: string): Promise<RestaurantType> {
    const data = await this.fetcher(`restaurant/${id}`);
    return RestaurantType.fromObject(data);
  }

  public async get_raw(id: string): Promise<any> {
    return await this.fetcher(`restaurant/${id}`);
  }

  public async get_raw_category_tree(id: string): Promise<any> {
    const options: RequestInit = {
      cache: 'no-store',
    }
  
    return await this.fetcher(`restaurant/${id}/category_tree`, options);
  }

  public async get_best_match_item(restaurantId: string, tag_ids: number[], category_ids: number[]): Promise<MenuItem | null> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag_ids: tag_ids, category_ids: category_ids }),
    };

    const data = await this.fetcher(`${restaurantId}/best_match_item`, options);
  
    if (data) {
      return MenuItem.fromObject(data);
    }

    return null;
  }
}