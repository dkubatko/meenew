import { Tag } from "@/app/types/tag";

export default class MenuItem {
  constructor(
    public id: number = 0,
    public restaurant_id: number = 0,
    public category_id: number,
    public item_name: string = '',
    public image_path: string = '',
    public tags: Tag[] = []
  ) { }

  static fromObject(object: any): MenuItem {
    const { id, restaurant_id, category_id, item_name, image_path, tags } = object;
    return new MenuItem(
      id, restaurant_id, category_id, item_name, image_path, tags.map(Tag.fromObject));
  }

  static new(restaurant_id: number, category_id: number): MenuItem {
    return new MenuItem(undefined, restaurant_id, category_id);
  }
}
