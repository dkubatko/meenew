import RestaurantAPIClient from './RestaurantAPI';
import TagAPIClient from './TagAPI';
import TagLabelAPIClient from './TagLabelAPI';
import MenuItemAPIClient from './MenuItemAPI';
import CategoryAPIClient from './CategoryAPI';

class APIClient {
  public readonly Restaurant: RestaurantAPIClient;
  public readonly Tag: TagAPIClient;
  public readonly TagLabel: TagLabelAPIClient;
  public readonly MenuItem: MenuItemAPIClient;
  public readonly Category: CategoryAPIClient;

  constructor(baseURL: string = "/api") {
    this.Restaurant = new RestaurantAPIClient(baseURL);
    this.Tag = new TagAPIClient(baseURL);
    this.TagLabel = new TagLabelAPIClient(baseURL);
    this.MenuItem = new MenuItemAPIClient(baseURL);
    this.Category = new CategoryAPIClient(baseURL);
  }
}

export default APIClient;

// Exporting an instance of APIClient which can be used across the application
export const ServerAPIClient = new APIClient(process.env.NEXT_PUBLIC_API_BASE_URL);