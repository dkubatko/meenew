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

  public async create(menuItem: MenuItemType): Promise<MenuItemType> {
    const data = await this.fetcher('menu_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem),
    });
    return MenuItemType.fromObject(data);
  }

  public async update(menuItem: MenuItemType): Promise<MenuItemType> {
    const data = await this.fetcher('menu_item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem),
    });
    return MenuItemType.fromObject(data);
  }

  public async uploadImage(image: File): Promise<{ image_url: string }> {
    const formData = new FormData();
    formData.append("image", image);
  
    return this.fetcher('menu_item_image_upload', {
      method: 'POST',
      body: formData
    });
  }
}
