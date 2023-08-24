import MenuItem from '@/app/types/menuItem';
import { TagLabel } from '@/app/types/tag';

export class CategoryLite {
  constructor(
    public id: number,
    public restaurant_id: number,
    public name: string,
    public parent: CategoryLite | null,
  ) { }

  static fromObject(object: any): CategoryLite {
    const { id, restaurant_id, name, parent } = object;
    return new CategoryLite(id, restaurant_id, name, parent && this.fromObject(parent));
  }
}

export class Category {
  constructor(
    public id: number,
    public restaurant_id: number,
    public name: string,
    public parent: CategoryLite | null,
    public menu_items: MenuItem[] = [],
    public tag_labels: TagLabel[] = []
  ) { }

  static fromObject(object: any): Category {
    const { id, restaurant_id, name, parent, menu_items, tag_labels } = object;
    return new Category(id,
      restaurant_id,
      name,
      parent && CategoryLite.fromObject(parent),
      menu_items,
      tag_labels);
  }

  static toCategoryLite(category: Category) {
    return new CategoryLite(
      category.id,
      category.restaurant_id,
      category.name,
      category.parent
    )
  }
}

export class CategoryTree {
  constructor(
    public id: number,
    public restaurant_id: number,
    public name: string,
    public parent: CategoryLite | null,
    public children: Category[] = [],
    public menu_items: MenuItem[] = [],
    public tag_labels: TagLabel[] = []
  ) { }

  static toCategoryType(categoryTree: CategoryTree): Category {
    return new Category(categoryTree.id, 
      categoryTree.restaurant_id,
      categoryTree.name,
      categoryTree.parent, 
      categoryTree.menu_items, 
      categoryTree.tag_labels);
  }

  static fromObject(object: any): CategoryTree {
    const { id, restaurant_id, name, parent, children, menu_items, tag_labels } = object;
    return new CategoryTree(
      id,
      restaurant_id,
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
    public restaurant_id: number,
    public parent_id: number
  ) { }
}

export class CategoryTreeLite {
  constructor(
    public id: number,
    public restaurant_id: number,
    public name: string,
    public children: CategoryTreeLite[] = [],
  ) { }

  static fromObject(object: any): CategoryTreeLite {
    const { id, restaurant_id, name, children } = object;
    return new CategoryTreeLite(
      id,
      restaurant_id,
      name,
      children ? children.map(CategoryTreeLite.fromObject) : [],
    );
  }
}

