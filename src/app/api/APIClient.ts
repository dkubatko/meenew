import RestaurantAPI from './RestaurantAPI';
import TagAPIClient from './TagAPI';
import MenuItemAPIClient from './MenuItemAPI';

class APIClient {
  public readonly Restaurant: RestaurantAPI;
  public readonly Tag: TagAPIClient;
  public readonly MenuItem: MenuItemAPIClient;

  constructor(baseURL: string = "/api") {
    this.Restaurant = new RestaurantAPI(baseURL);
    this.Tag = new TagAPIClient(baseURL);
    this.MenuItem = new MenuItemAPIClient(baseURL);
  }
}

export default APIClient;

// Exporting an instance of APIClient which can be used across the application
export const ServerAPIClient = new APIClient();