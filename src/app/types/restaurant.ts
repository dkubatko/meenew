import MenuItem from "@/app/types/menuItem";
import { Category } from "@/app/types/category";

export default class Restaurant {
  constructor(
    public id: number,
    public restaurant_name: string,
    public menu_items: MenuItem[],
    public root_category?: Category
  ) { }

  static fromObject(object: any): Restaurant {
    const { id, restaurant_name, menu_items, root_category } = object;
    return new Restaurant(
      id,
      restaurant_name,
      menu_items.map(MenuItem.fromObject),
      root_category);
  }
}