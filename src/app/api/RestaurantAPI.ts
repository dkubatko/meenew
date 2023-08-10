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

  public async getQuestionnaire(id: string): Promise<Question> {
    const data = await this.fetcher(`${id}/questionnaire`);
    return Question.fromObject(data);
  }

  public async getBestMatchItem(restaurantId: string, tags: Tag[]): Promise<MenuItem | null> {
    const options: RequestInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tags),
    };

    const data = await this.fetcher(`${restaurantId}/best-match-item`, options);
    if (data) {
      return MenuItem.fromObject(data);
    }
    return null;
  }
}