'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, TagCreate } from "@/app/types/tag";
import MenuItemType from "@/app/types/menuItem";
import TagCategory from "../shared/tagCategory.component";
import styles from "@/app/components/owner/restaurant.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import MenuItem from "@/app/components/shared/menuItem.component";
import Modal from 'react-overlays/Modal';
import NewTagForm from "./newTagForm.component";
import TagModal from "@/app/components/owner/tagModal.component";
import useFetchRestaurant from '@/app/hooks/useFetchRestaurant';
import useFetchTagTree from '@/app/hooks/useFetchTagTree';
import MenuItemModal, { MenuItemFormData } from "./menuItemModal.component";
import APIClient, { ServerAPIClient } from "@/app/api/APIClient";

export default function Restaurant() {
  const searchParams = useSearchParams();
  const { restaurantData, fetchRestaurantData } = useFetchRestaurant(searchParams.get('id') ?? '0');
  const { rootTag, fetchTagTree } = useFetchTagTree();

  const { restaurant_name = "", menu_items = [] } = restaurantData || {};

  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>();

  const [showNewTagModal, setShowNewTagModal] = useState<boolean>(false);
  const [showEditTagModal, setShowEditTagModal] = useState<boolean>(false);
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

  function handleAddTag(parentTag: TagType) {
    setSelectedTag(parentTag);
    setShowNewTagModal(true);
  }

  async function handleTagSubmit(tag: TagCreate) {
    if (!tag) {
      console.log("Empty tag");
      return;
    }
  
    const createdTag = await ServerAPIClient.Tag.create(tag);
  
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

  async function handleDeleteTag(tag: TagType) {
    const result = await ServerAPIClient.Tag.delete(tag.id);

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
    const updatedTag = await ServerAPIClient.Tag.update(tag);
  
    if (!updatedTag) {
      console.error('An error occurred while updating a tag');
      return;
    }
  
    // Update the tag list with new data.
    fetchTagTree();
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
            <button
              className={sharedStyles.addButton}
              onClick={() => setShowAddMenuItemModal(true)}
            >
              +
            </button>
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
          show={showEditMenuItemModal}
          onHide={() => setShowEditMenuItemModal(false)}
          renderBackdrop={() => Backdrop(() => setShowEditMenuItemModal(false))}
        >
          <MenuItemModal
            onCancel={() => setShowEditMenuItemModal(false)}
            onConfirm={handleEditMenuItemModalConfirm}
            menu_item={selectedMenuItem!}
            tagList={rootTag?.toTagLeafList()!}
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
            tagList={rootTag?.toTagLeafList()!}
            edit={false}
          />
        </Modal>
      </div>
    </div>
  )
}