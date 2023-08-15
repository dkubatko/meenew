import MenuItem from '@/app/types/menuItem';
import { TagLabel } from '@/app/types/tag';

export class Category {
  constructor(
    public id: number,
    public name: string,
    public parent: Category,
    public menu_items: MenuItem[] = [],
    public tag_labels: TagLabel[] = []
  ) { }

  static fromObject(object: any): Category {
    const { id, name, parent, menu_items, tag_labels } = object;
    return new Category(id, name, parent && this.fromObject(parent), menu_items, tag_labels);
  }
}

export class CategoryTree {
  constructor(
    public id: number,
    public name: string,
    public parent: Category,
    public children: CategoryTree[] = [],
    public menu_items: any[] = [],
    public tag_labels: any[] = []
  ) { }

  toCategoryType(): Category {
    return new Category(this.id, this.name, this.parent, this.menu_items, this.tag_labels);
  }

  static fromObject(object: any): CategoryTree {
    const { id, name, parent, children, menu_items, tag_labels } = object;
    return new CategoryTree(
      id,
      name,
      Category.fromObject(parent),
      children ? children.map(CategoryTree.fromObject) : [],
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

