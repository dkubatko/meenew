'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, TagTree as TagTreeType, Restaurant as RestaurantType, MenuItem as MenuItemType, TagCreate } from "@/app/types/menu";
import TagCategory from "../shared/tag_category.component";
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";
import Modal from 'react-overlays/Modal';
import NewTagForm from "./new_tag_form.component";
import TagModal from "@/app/components/owner/tag_modal.component";
import useFetchRestaurant from '@/app/hooks/useFetchRestaurant';
import useFetchTagTree from '@/app/hooks/useFetchTagTree';
import MenuItemModal, { MenuItemFormData } from "./menu_item_modal.component";
import { ServerAPIClient } from "@/app/api/APIClient";

interface ImageUploadResponse {
  menu_item: MenuItemType;
}

export default function Restaurant() {
  const searchParams = useSearchParams();
  const { restaurantData, fetchRestaurant } = useFetchRestaurant(searchParams.get('id') ?? '0');
  const { rootTag, fetchTagTree } = useFetchTagTree();

  const { restaurant_name = "", menu_items = [] } = restaurantData || {};

  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>();

  const [showNewTagModal, setShowNewTagModal] = useState<boolean>(false);
  const [showEditTagModal, setShowEditTagModal] = useState<boolean>(false);
  const [showMenuItemModal, setShowMenuItemModal] = useState<boolean>(false);

  function Backdrop(onClick: () => void) {
    return (
      <div
        className={styles.backdrop}
        onClick={onClick}
      />
    )
  }

  function handleAddTag(parentTag: TagType) {
    setSelectedTag(parentTag);
    setShowNewTagModal(true);
  }

  async function handleTagSubmit(tag: TagCreate) {
    if (!tag) {
      console.log("Empty tag");
      return;
    }
  
    const createdTag = await ServerAPIClient.createTag(tag);
  
    if (!createdTag) {
      console.error('An error occurred while creating a tag');
      return;
    }
  
    // Update the tag list with new data.
    fetchTagTree();
  
    // Close the modal after successful update.
    setShowNewTagModal(false);
  }

  function handleEditTagClick(tag: TagType) {
    setSelectedTag(tag);
    setShowEditTagModal(true);
  }

  async function handleMenuItemEditModalConfirm({ id, image }: MenuItemFormData) {
    if (!image) {
      console.log("Empty image");
      return;
    }

    const updatedMenuItem = await ServerAPIClient.updateMenuItem(id, image);

    if (!updatedMenuItem) {
      console.error('An error occurred while updating a menu item');
      return;
    }
    
    // Update menu items.
    fetchRestaurant();
    // Close the modal after successful update.
    setShowMenuItemModal(false);
  }

  async function handleDeleteTag(tag: TagType) {
    const result = await ServerAPIClient.deleteTag(tag.id);

    if (!result || !result.ok) {
      console.error('An error occurred while deleting a tag');
      return;
    }

    // Update the tag list with new data.
    fetchTagTree();
    // Close the modal after successful deletion.
    setShowEditTagModal(false);
  }

  async function handleEditTag(tag: TagType) {
    const updatedTag = await ServerAPIClient.updateTag(tag);
  
    if (!updatedTag) {
      console.error('An error occurred while updating a tag');
      return;
    }
  
    // Update the tag list with new data.
    fetchTagTree();
    // Close the modal after successful update.
    setShowEditTagModal(false);
  }

  function handleMenuItemEditClick(menu_item: MenuItemType) {
    setSelectedMenuItem(menu_item);
    setShowMenuItemModal(true);
  }

  return (
    <div className={styles.restaurantView}>
      <div className={styles.restaurantName}>
        {restaurant_name}
      </div>
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className={styles.title}>Menu</div>
          <div className={styles.itemlist}>
            {
              menu_items.map((menu_item: MenuItemType) => (
                <MenuItem
                  key={menu_item.id}
                  menu_item={menu_item}
                  editable={true}
                  onEdit={() => handleMenuItemEditClick(menu_item)}
                />
              ))
            }
          </div>
        </div>
        <div className={styles.tags}>
          <div className={styles.title}>Tags</div>
          <div className={styles.taglist}>
            {rootTag && <TagCategory rootTag={rootTag} onAddTag={handleAddTag} onEditTag={handleEditTagClick} />}
          </div>
        </div>
        <Modal
          className={styles.modal}
          show={showNewTagModal}
          onHide={() => setShowNewTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowNewTagModal(false))}
        >
          <NewTagForm handlePostSubmit={handleTagSubmit} parentTag={selectedTag!} />
        </Modal>
        <Modal
          className={styles.modal}
          show={showEditTagModal}
          onHide={() => setShowEditTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowEditTagModal(false))}
        >
          <TagModal
            tag={selectedTag!}
            onConfirm={() => handleEditTag(selectedTag!)}
            onDelete={() => handleDeleteTag(selectedTag!)}
            onCancel={() => setShowEditTagModal(false)}
          />
        </Modal>
        <Modal
          className={styles.modal}
          show={showMenuItemModal}
          onHide={() => setShowMenuItemModal(false)}
          renderBackdrop={() => Backdrop(() => setShowMenuItemModal(false))}
        >
          <MenuItemModal
            onCancel={() => setShowMenuItemModal(false)}
            onConfirm={handleMenuItemEditModalConfirm}
            menu_item={selectedMenuItem!}
            edit={true}
          />
        </Modal>
      </div>
    </div>
  )
}