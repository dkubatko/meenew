import RestaurantAPIClient from './RestaurantAPI';
import TagAPIClient from './TagAPI';
import MenuItemAPIClient from './MenuItemAPI';
import CategoryAPIClient from './CategoryAPI';

class APIClient {
  public readonly Restaurant: RestaurantAPIClient;
  public readonly Tag: TagAPIClient;
  public readonly MenuItem: MenuItemAPIClient;
  public readonly Category: CategoryAPIClient;

  constructor(baseURL: string = "http://127.0.0.1:8000/api") {
    this.Restaurant = new RestaurantAPIClient(baseURL);
    this.Tag = new TagAPIClient(baseURL);
    this.MenuItem = new MenuItemAPIClient(baseURL);
    this.Category = new CategoryAPIClient(baseURL);
  }
}

export default APIClient;

// Exporting an instance of APIClient which can be used across the application
export const ServerAPIClient = new APIClient();