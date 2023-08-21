import { useState } from 'react';
import { CategoryTree, Category, CategoryLite } from '@/app/types/category';
import MenuItem from '@/app/components/shared/menuItem.component';
import styles from '@/app/components/owner/categoryView.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';
import MenuItemType from '@/app/types/menuItem';
import Modal from 'react-overlays/Modal';
import Backdrop from "@/app/util/backdrop";
import { TagLabel as TagLabelType, Tag as TagType } from '@/app/types/tag';
import MenuItemModal, { MenuItemFormData } from '@/app/components/owner/menuItemModal.component';
import { ServerAPIClient } from '@/app/api/APIClient';
import InlineInputWithButton from '../shared/inlineInputWithButton.component';

interface CategoryViewProps {
  categoryTree: CategoryTree;
  tagLabels: TagLabelType[];
  handleCategoryClick: (category: CategoryLite) => void;
  handleAddSubcategory?: (category: CategoryTree) => void;
}

export default function CategoryView({
  categoryTree,
  tagLabels,
  handleCategoryClick,
  handleAddSubcategory,
}: CategoryViewProps) {
  const [currentCategoryTree, setCurrentCategoryTree] = useState<CategoryTree>(categoryTree);
  const [currentMenuItems, setCurrentMenuItems] = useState<MenuItemType[]>(categoryTree.menu_items);

  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState<boolean>(false);

  const renderCategoryPath = (category: CategoryLite) => {
    let pathElements: React.ReactNode[] = [];
    let currentCategory: CategoryLite | null = category;

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

  async function handleAddMenuItem({ menu_item, image }: MenuItemFormData) {
    // If new image is added, upload it to the server and update the image_path on the item.
    if (image) {
      const imageUrl = (await ServerAPIClient.MenuItem.uploadImage(image)).image_url;

      if (!imageUrl) {
        console.log("Could not upload image");
        return;
      }

      menu_item.image_path = imageUrl
    }

    const createdMenuItem = await ServerAPIClient.MenuItem.create(menu_item);

    if (!createdMenuItem) {
      console.error('An error occurred while creating a menu item');
      return;
    }

    setCurrentMenuItems(() => [...currentMenuItems, createdMenuItem]);

    // Close the modal after successful update.
    setShowAddMenuItemModal(false);
  }

  function handleMenuItemEdit(updatedMenuItem: MenuItemType) {
    setCurrentMenuItems(prevMenuItems => {
      return prevMenuItems.map(menuItem =>
        menuItem.id === updatedMenuItem.id ? updatedMenuItem : menuItem // Replace the edited menuItem
      );
    });
  }

  function handleMenuItemDelete(deletedMenuItem: MenuItemType) {
    setCurrentMenuItems(prevMenuItems => {
      return prevMenuItems.filter(menuItem => menuItem.id !== deletedMenuItem.id); // Exclude the deleted menuItem
    });
  }

  async function handleCategoryEdit(category: CategoryLite) {
    const updatedCategory = await ServerAPIClient.Category.update(category);
  
    if (!updatedCategory) {
      console.error('An error occurred while updating category.');
      return;
    }
  
    const updatedChildren = currentCategoryTree.children.map(child =>
      child.id === updatedCategory.id ? { ...child, name: updatedCategory.name } : child
    );
  
    setCurrentCategoryTree({
      ...currentCategoryTree,
      children: updatedChildren,
    });
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.categoryNav}>
          {renderCategoryPath(currentCategoryTree)}
        </div>
        {currentCategoryTree.children.length > 0 && <div className={styles.subcategories}>
          {currentCategoryTree.children?.map((childCategory: Category) => (
            <div className={styles.subcategory} key={childCategory.id}>
              <InlineInputWithButton
                  onClick={() => handleCategoryClick(childCategory)}
                  onSubmit={(name: string) => {
                    const categoryToUpdate = Category.toCategoryLite(childCategory);
                    categoryToUpdate.name = name;
                    handleCategoryEdit(categoryToUpdate);
                  }}
                  initialValue={childCategory.name}
                  styles={styles}
              />
              <div className={styles.subcategoryPreview}>
                {childCategory.menu_items.map((menuItem: any) => (
                  <MenuItem
                    key={menuItem.id}
                    menu_item={menuItem}
                  />
                ))}
              </div>
            </div>
          ))}
          {handleAddSubcategory && <button
            onClick={() => handleAddSubcategory(currentCategoryTree)}
            className={sharedStyles.bigButton}
          >
            Add Subcategory
          </button>}
        </div>}
        <div className={styles.items}>
          {currentMenuItems.map((menuItem: any) => (
            <MenuItem
              key={menuItem.id}
              menu_item={menuItem}
              editable={true}
              postEdit={handleMenuItemEdit}
              postDelete={handleMenuItemDelete}
              // TODO: Update this logic to pass in tag labels directly.
              tagList={tagLabels.reduce((tagsList: TagType[], tagLabel: TagLabelType) => {
                return tagsList.concat(tagLabel.tags || []);
              }, [])}
            />
          ))}
          {<button
            onClick={() => setShowAddMenuItemModal(true)}
            className={sharedStyles.bigButton}
          >
            Add Item
          </button>}
        </div>
      </div>
      <Modal
        className={sharedStyles.modal}
        show={showAddMenuItemModal}
        onHide={() => setShowAddMenuItemModal(false)}
        renderBackdrop={() => Backdrop(() => setShowAddMenuItemModal(false))}
      >
        <MenuItemModal
          onCancel={() => setShowAddMenuItemModal(false)}
          onConfirm={handleAddMenuItem}
          menu_item={MenuItemType.new(currentCategoryTree.restaurant_id, currentCategoryTree.id)}
          // Expand current tag labels into a list of tags that belong to these labels.
          tagList={tagLabels.reduce((tagsList: TagType[], tagLabel: TagLabelType) => {
            return tagsList.concat(tagLabel.tags || []);
          }, [])}
          edit={false}
        />
      </Modal>
    </>
  );
}
