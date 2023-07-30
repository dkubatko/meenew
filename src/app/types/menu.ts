export type Restaurant = {
  id: number
  restaurant_name: string
  menu_items: MenuItem[]
}

export class Tag {
  constructor(
    public id: number,
    public name: string,
    public parent_id: number,
    public is_leaf: boolean = false
  ) { }
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

export type MenuItem = {
  id: number
  item_name: string
  image_path: string
  tags: Tag[]
}



