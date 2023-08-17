import MenuItem from '@/app/types/menuItem';
import { TagLabel } from '@/app/types/tag';

export class CategoryLite {
  constructor(
    public id: number,
    public name: string,
    public parent: CategoryLite | null,
  ) { }

  static fromObject(object: any): CategoryLite {
    const { id, name, parent } = object;
    return new Category(id, name, parent && this.fromObject(parent));
  }
}

export class Category {
  constructor(
    public id: number,
    public name: string,
    public parent: CategoryLite | null,
    public menu_items: MenuItem[] = [],
    public tag_labels: TagLabel[] = []
  ) { }

  static fromObject(object: any): Category {
    const { id, name, parent, menu_items, tag_labels } = object;
    return new Category(id, name, parent && CategoryLite.fromObject(parent), menu_items, tag_labels);
  }
}

export class CategoryTree {
  constructor(
    public id: number,
    public name: string,
    public parent: CategoryLite | null,
    public children: Category[] = [],
    public menu_items: any[] = [],
    public tag_labels: any[] = []
  ) { }

  static toCategoryType(categoryTree: CategoryTree): Category {
    return new Category(categoryTree.id, 
      categoryTree.name, 
      categoryTree.parent, 
      categoryTree.menu_items, 
      categoryTree.tag_labels);
  }

  static fromObject(object: any): CategoryTree {
    const { id, name, parent, children, menu_items, tag_labels } = object;
    return new CategoryTree(
      id,
      name,
      parent && CategoryLite.fromObject(parent),
      children ? children.map(Category.fromObject) : [],
      menu_items,
      tag_labels
    );
  }
}

export class CategoryCreate {
  constructor(
    public name: string,
    public parent_id: number
  ) { }
}

