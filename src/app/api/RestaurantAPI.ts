import { Restaurant as RestaurantType } from "@/app/types/menu";

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
}