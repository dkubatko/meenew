import { CategoryTree } from '@/app/types/category';
import MenuItem from '@/app/components/shared/menuItem.component';
import styles from '@/app/components/owner/categoryView.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';

interface CategoryViewProps {
  categoryTree: CategoryTree;
  handleCategoryClick: (category: CategoryTree) => void;
  handleAddMenuItem?: (category: CategoryTree) => void;
  handleAddSubcategory?: (category: CategoryTree) => void;
}

export default function CategoryView({
  categoryTree,
  handleCategoryClick,
  handleAddMenuItem,
  handleAddSubcategory,
}: CategoryViewProps) {
  const allMenuItemsInBranch = (category: CategoryTree): any[] => {
    const items = category.menu_items || [];
    if (category.children) {
      category.children.forEach(child => {
        items.push(...allMenuItemsInBranch(child));
      });
    }
    return items;
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{categoryTree.name}</div>
      <div className={styles.subcategories}>
        {categoryTree.children?.map((childCategory: CategoryTree) => (
          <div className={styles.subcategoryPreview} key={childCategory.id}>
            <div
              onClick={() => handleCategoryClick(childCategory)}
              className={styles.subcategoryTitle}
            >
                {childCategory.name}
            </div>
            <div className={styles.subcategoryPreview}>
              {allMenuItemsInBranch(childCategory).map((menuItem: any) => (
                <MenuItem key={menuItem.id} menu_item={menuItem} /> 
              ))}
            </div>
          </div>
        ))}
        {handleAddSubcategory && <button
          onClick={() => handleAddSubcategory(categoryTree)}
          className={sharedStyles.addButton}
        >
          Add Subcategory
        </button>}
      </div>

      <div className={styles.items}>
        {categoryTree.menu_items?.map((menuItem: any) => (
          // TODO: make editable
          <MenuItem key={menuItem.id} menu_item={menuItem} />
        ))}
        {handleAddMenuItem && <button
          onClick={() => handleAddMenuItem(categoryTree)}
          className={sharedStyles.addButton}
        >
          Add Item
        </button>}
      </div>
    </div>
  );
}
