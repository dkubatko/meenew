import { MenuItem as MenuItemType } from "../types/menu";

export default class MenuItemAPIClient {
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

  public async update(id: number, image: File): Promise<MenuItemType> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("menu_item_id", id.toString());
  
    return this.fetcher('menu_item_image_upload', {
      method: 'POST',
      body: formData
    });
  }
}
