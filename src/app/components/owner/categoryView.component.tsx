import { CategoryTree, Category } from '@/app/types/category';
import MenuItem from '@/app/components/shared/menuItem.component';
import styles from '@/app/components/owner/categoryView.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';
import MenuItemType from '@/app/types/menuItem';

interface CategoryViewProps {
  categoryTree: CategoryTree;
  handleCategoryClick: (category: CategoryTree | Category) => void;
  handleAddMenuItem?: (category: CategoryTree) => void;
  handleAddSubcategory?: (category: CategoryTree) => void;
  handleMenuItemEdit?: (menuItem: MenuItemType) => void;
}

export default function CategoryView({
  categoryTree,
  handleCategoryClick,
  handleAddMenuItem,
  handleAddSubcategory,
  handleMenuItemEdit
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

  const renderCategoryPath = (category: Category) => {
    let pathElements: React.ReactNode[] = [];
    let currentCategory: Category | undefined = category;
    
    // Traverse up the tree to diplay path to current category.
    while (currentCategory) {
      const categoryToClick = currentCategory;
      pathElements.unshift(
        <span 
          key={categoryToClick.id} 
          onClick={() => handleCategoryClick(categoryToClick)}
          className={styles.category}
        >
          {categoryToClick.name}
        </span>
      );
      currentCategory = currentCategory.parent;
    }
  
    // Insert separators between the categories.
    for (let i = pathElements.length - 1; i > 0; i--) {
      pathElements.splice(i, 0, <span key={`sep${i}`} className={styles.separator}>&gt;</span>);
    }
  
    return pathElements;
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.categoryNav}>{renderCategoryPath(categoryTree)}</div>
      {categoryTree.children.length > 0 && <div className={styles.subcategories}>
        {categoryTree.children?.map((childCategory: CategoryTree) => (
          <div className={styles.subcategory} key={childCategory.id}>
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
      </div>}
      <div className={styles.items}>
        {categoryTree.menu_items?.map((menuItem: any) => (
          // TODO: make editable
          <MenuItem 
            key={menuItem.id} 
            menu_item={menuItem}
            editable={handleMenuItemEdit ? true : false}
            onEdit={() => handleMenuItemEdit && handleMenuItemEdit(menuItem)}
          />
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
