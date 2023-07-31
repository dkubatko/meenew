export class Restaurant {
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

export class Tag {
  constructor(
    public id: number,
    public name: string,
    public parent_id: number,
    public is_leaf: boolean = false
  ) { }

  static fromObject(object: any): Tag {
    const { id, name, parent_id, is_leaf } = object;
    return new Tag(
      id,
      name,
      parent_id,
      is_leaf);
  }
}

export class TagTree {
  constructor(
    public id: number,
    public name: string,
    public parent_id: number,
    public children?: TagTree[],
    public is_leaf: boolean = true
  ) { }

  toTagType(): Tag {
    return new Tag(this.id, this.name, this.parent_id, this.is_leaf);
  }

  static fromObject(object: any): TagTree {
    const { id, name, parent_id, children, is_leaf } = object;
    return new TagTree(
      id,
      name,
      parent_id,
      children ? children.map(TagTree.fromObject) : undefined,
      is_leaf);
  }
}

export type TagCreate = {
  name: string
  parent_id: number
}

export class MenuItem {
  constructor(
    public id: number = 0,
    public restaurant_id: number = 0,
    public item_name: string = '',
    public image_path: string = '',
    public tags: Tag[] = []
  ) { }

  static fromObject(object: any): MenuItem {
    const { id, restaurant_id, item_name, image_path, tags } = object;
    return new MenuItem(
      id, restaurant_id, item_name, image_path, tags.map(Tag.fromObject));
  }

  static new(restaurant_id: number): MenuItem {
    return new MenuItem(undefined, restaurant_id);
  }
}

