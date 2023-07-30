import { TagTree as TagTreeType, Restaurant as RestaurantType, Tag as TagType, TagCreate, MenuItem as MenuItemType } from "../types/menu";

class APIClient {
  private readonly baseURL: string;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  private async fetcher(endpoint: string, options?: RequestInit) {
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

  public async getRestaurant(id: string): Promise<RestaurantType> {
    // TODO: Convert to restaurant class
    return this.fetcher(`restaurant/${id}`);
  }

  public async getTagTree(): Promise<TagTreeType> {
    const data = await this.fetcher('tag_tree');
    return TagTreeType.fromObject(data);
  }

  public async createTag(tag: TagCreate): Promise<TagType> {
    return this.fetcher('tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
  }

  public async updateTag(tag: TagCreate): Promise<TagType> {
    return this.fetcher('tag', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });
  }

  public deleteTag(id: number): Promise<{ok: boolean}> {
    return this.fetcher(`tag/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public async updateMenuItem(id: number, image: File): Promise<MenuItemType> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("menu_item_id", id.toString());
  
    return this.fetcher('menu_item_image_upload', {
      method: 'POST',
      body: formData
    });
  }
}

// Exporting an instance of APIClient which can be used across the application
export const ServerAPIClient = new APIClient();