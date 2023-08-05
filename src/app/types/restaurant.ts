import MenuItem from "@/app/types/menuItem";

export default class Restaurant {
  constructor(
    public id: number,
    public restaurant_name: string,
    public menu_items: MenuItem[]
  ) { }

  static fromObject(object: any): Restaurant {
    const { id, restaurant_name, menu_items } = object;
    return new Restaurant(
      id,
      restaurant_name,
      menu_items.map(MenuItem.fromObject));
  }
}