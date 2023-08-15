'use client';

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, TagCreate, TagLabel as TagLabelType } from "@/app/types/tag";
import MenuItemType from "@/app/types/menuItem";
import TagLabel from "@/app/components/shared/tagLabel.component";
import styles from "@/app/components/owner/restaurant.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import Modal from 'react-overlays/Modal';
import TagModal from "@/app/components/owner/tagModal.component";
import useFetchRestaurant from '@/app/hooks/useFetchRestaurant';
import MenuItemModal, { MenuItemFormData } from "./menuItemModal.component";
import { ServerAPIClient } from "@/app/api/APIClient";
import { CategoryTree, Category } from "@/app/types/category";
import { getCategoryTreeByPath, getPathToRoot } from "@/app/util/categoryUtil";
import CategoryView from "./categoryView.component";

export default function Restaurant() {
  const searchParams = useSearchParams();
  const { restaurantData, fetchRestaurantData } = useFetchRestaurant(searchParams.get('id') ?? '0');
  const [currentCategory, setCurrentCategory] = useState<CategoryTree>();
  const hasSetInitialCategory = useRef(false);

  const [currentTagLabels, setCurrentTagLabels] = useState<TagLabelType[]>([]);

  // Instnatiate currentCategory on restaurant data first retrieval.
  useEffect(() => {
    if (restaurantData && !hasSetInitialCategory.current) {
      setCurrentCategory(restaurantData.root_category);
      hasSetInitialCategory.current = true;
    } else if (restaurantData && currentCategory) {
      const pathToCurrentCategory = getPathToRoot(currentCategory);
      const newCurrentCategory = getCategoryTreeByPath(restaurantData.root_category, pathToCurrentCategory);
      if (newCurrentCategory) {
        setCurrentCategory(newCurrentCategory);
      }
    }
  }, [restaurantData, currentCategory]);
  

  // Update current tags to be displayed based on retrieved category.
  useEffect(() => {
    setCurrentTagLabels(currentCategory?.tag_labels || []);
  }, [currentCategory]);

  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [selectedTagLabel, setSelectedTagLabel] = useState<TagLabelType>();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>();

  const [showNewTagModal, setShowNewTagModal] = useState<boolean>(false);
  const [showEditTagModal, setShowEditTagModal] = useState<boolean>(false);
  const [showEditTagLabelModal, setShowEditTagLabelModal] = useState<boolean>(false);
  const [showEditMenuItemModal, setShowEditMenuItemModal] = useState<boolean>(false);
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState<boolean>(false);

  function Backdrop(onClick: () => void) {
    return (
      <div
        className={styles.backdrop}
        onClick={onClick}
      />
    )
  }

  function handleAddTag(parentTag: TagLabelType) {
    setSelectedTagLabel(parentTag);
    setShowNewTagModal(true);
  }

  async function handleTagSubmit(tag: TagType) {
    if (!tag) {
      console.log("Empty tag");
      return;
    }

    const createdTag = await ServerAPIClient.Tag.create(tag);

    if (!createdTag) {
      console.error('An error occurred while creating a tag');
      return;
    }

    // Close the modal after successful update.
    setShowNewTagModal(false);
  }

  function handleEditTagClick(tag: TagType) {
    setSelectedTag(tag);
    setShowEditTagModal(true);
  }

  function handleEditTagLabelClick(tagLabel: TagLabelType) {
    setSelectedTagLabel(tagLabel);
    setShowEditTagLabelModal(true);
  }

  async function handleDeleteTag(tag: TagType) {
    const result = await ServerAPIClient.Tag.delete(tag.id);

    if (!result || !result.ok) {
      console.error('An error occurred while deleting a tag');
      return;
    }

    // TODO!: This should instead only update the current category.
    fetchRestaurantData();
    // Close the modal after successful deletion.
    setShowEditTagModal(false);
  }

  async function handleEditTag(tag: TagType) {
    const updatedTag = await ServerAPIClient.Tag.update(tag);

    if (!updatedTag) {
      console.error('An error occurred while updating a tag');
      return;
    }

    // Update menu items.
    fetchRestaurantData();
    // Close the modal after successful update.
    setShowEditTagModal(false);
  }

  async function handleEditMenuItemModalConfirm({ menu_item, image }: MenuItemFormData) {
    // If new image is added, upload it to the server and update the image_path on the item.
    if (image) {
      const imageUrl = (await ServerAPIClient.MenuItem.uploadImage(image)).image_url;

      if (!imageUrl) {
        console.log("Could not upload image");
        return;
      }

      menu_item.image_path = imageUrl
    }

    const updatedMenuItem = await ServerAPIClient.MenuItem.update(menu_item);

    if (!updatedMenuItem) {
      console.error('An error occurred while updating a menu item');
      return;
    }

    // Update menu items.
    fetchRestaurantData();
    // Close the modal after successful update.
    setShowEditMenuItemModal(false);
  }

  async function handleEditMenuItemModalDelete(menuItem: MenuItemType) {
    const result = await ServerAPIClient.MenuItem.delete(menuItem.id);

    if (!result || !result.ok) {
      console.error('An error occurred while deleting a menu item');
      return;
    }

    // Update menu items.
    fetchRestaurantData();
    // Close the modal after successful update.
    setShowEditMenuItemModal(false);
  }

  async function handleAddMenuItemModalConfirm({ menu_item, image }: MenuItemFormData) {
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
      console.error('An error occurred while creating a tag');
      return;
    }

    // Update menu items.
    fetchRestaurantData();
    // Close the modal after successful update.
    setShowAddMenuItemModal(false);
  }

  function handleMenuItemEditClick(menu_item: MenuItemType) {
    setSelectedMenuItem(menu_item);
    setShowEditMenuItemModal(true);
  }

  const handleCategoryClick = (category: CategoryTree | Category) => {
    if ((category as CategoryTree).children) {
      // It's a CategoryTree, just set it
      setCurrentCategory(category as CategoryTree);
    } else {
      // It's a Category, find the CategoryTree object
      const path = getPathToRoot(category as Category);
      const categoryTree = getCategoryTreeByPath(restaurantData!.root_category, path);
      if (categoryTree) {
        setCurrentCategory(categoryTree);
      }
    }
  };

  return (
    <div className={styles.restaurantView}>
      <div className={styles.restaurantName}>
        {restaurantData?.restaurant_name}
      </div>
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className={styles.title}>Menu</div>
          <div className={styles.itemlist}>
            {currentCategory && 
              <CategoryView
                categoryTree={currentCategory}
                handleCategoryClick={handleCategoryClick}
                handleMenuItemEdit={handleMenuItemEditClick}
                handleAddMenuItem={() => setShowAddMenuItemModal(true)}
              />
            }
          </div>
        </div>
        <div className={styles.tags}>
          <div className={styles.title}>Tags</div>
          <div className={styles.taglist}>
            {
              currentTagLabels && currentTagLabels.map(
                (tagLabel: TagLabelType) =>
                  <TagLabel
                    key={tagLabel.id}
                    tagLabel={tagLabel}
                    onAddTag={handleAddTag}
                    onEditTagLabel={handleEditTagLabelClick}
                    onEditTag={handleEditTagClick}
                  />
              )
            }
          </div>
        </div>
        <Modal
          className={styles.modal}
          show={showNewTagModal}
          onHide={() => setShowNewTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowNewTagModal(false))}
        >
          <TagModal
            tag={TagType.new(selectedTagLabel?.id || 0)}
            onConfirm={handleTagSubmit}
            onCancel={() => setShowNewTagModal(false)}
            isAdd={true}
          />
        </Modal>
        <Modal
          className={styles.modal}
          show={showEditTagModal}
          onHide={() => setShowEditTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowEditTagModal(false))}
        >
          <TagModal
            tag={selectedTag!}
            onConfirm={handleEditTag}
            onDelete={handleDeleteTag}
            onCancel={() => setShowEditTagModal(false)}
          />
        </Modal>
        <Modal
          className={styles.modal}
          show={showEditMenuItemModal}
          onHide={() => setShowEditMenuItemModal(false)}
          renderBackdrop={() => Backdrop(() => setShowEditMenuItemModal(false))}
        >
          <MenuItemModal
            onCancel={() => setShowEditMenuItemModal(false)}
            onConfirm={handleEditMenuItemModalConfirm}
            onDelete={handleEditMenuItemModalDelete}
            menu_item={selectedMenuItem!}
            // Expand current tag labels into a list of tags that belong to these labels.
            tagList={currentTagLabels.reduce((tagsList: TagType[], tagLabel: TagLabelType) => {
              return tagsList.concat(tagLabel.tags || []);
            }, [])}
            
            edit={true}
          />
        </Modal>
        <Modal
          className={styles.modal}
          show={showAddMenuItemModal}
          onHide={() => setShowAddMenuItemModal(false)}
          renderBackdrop={() => Backdrop(() => setShowAddMenuItemModal(false))}
        >
          <MenuItemModal
            onCancel={() => setShowAddMenuItemModal(false)}
            onConfirm={handleAddMenuItemModalConfirm}
            menu_item={MenuItemType.new(restaurantData?.id!)}
            // Expand current tag labels into a list of tags that belong to these labels.
            tagList={currentTagLabels.reduce((tagsList: TagType[], tagLabel: TagLabelType) => {
              return tagsList.concat(tagLabel.tags || []);
            }, [])}
            edit={false}
          />
        </Modal>
      </div>
    </div>
  )
}