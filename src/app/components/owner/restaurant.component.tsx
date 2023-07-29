'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, TagTree as TagTreeType, Restaurant as RestaurantType, MenuItem as MenuItemType } from "@/app/types/menu";
import TagCategory from "../shared/tag_category.component";
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";
import Modal from 'react-overlays/Modal';
import NewTagForm from "./new_tag_form.component";
import ConfirmationModal from "../shared/confirmation_modal.component";
import MenuItemModal, { MenuItemFormData } from "./menu_item_modal.component";

interface ImageUploadResponse {
  menu_item: MenuItemType;
}

export default function Restaurant() {
  const [restaurantData, setRestaurantData] = useState<RestaurantType>();
  const [rootTag, setRootTag] = useState<TagTreeType>();
  const searchParams = useSearchParams();
  const { restaurant_name = "", menu_items = [] } = restaurantData || {};
  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [showNewTagModal, setShowNewTagModal] = useState<boolean>(false);
  const [showDeleteTagModal, setShowDeleteTagModal] = useState<boolean>(false);
  const [showMenuItemModal, setShowMenuItemModal] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>();

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurant/${searchParams.get('id') ?? '0'}`),
      fetch('/api/tag_tree'),
    ])
      .then(([resRestaurant, resRootTag]) =>
        Promise.all([resRestaurant.json(), resRootTag.json()])
      )
      .then(([restaurant, rootTag]) => {
        setRestaurantData(restaurant);
        setRootTag(rootTag);
      });
  }, [searchParams]);

  function Backdrop(onClick: () => void) {
    return (
      <div
        className={styles.backdrop}
        onClick={onClick}
      />
    )
  }

  function handleAddTag(tag: TagType) {
    setSelectedTag(tag);
    setShowNewTagModal(true);
  }

  function handlePostTagSubmit(tag: TagType) {
    if (!tag) {
      console.log("Empty tag");
      return;
    }
    const htmlFormData = new FormData();
    htmlFormData.append("name", tag.name);
    htmlFormData.append("parent_id", tag.parent_id!.toString());
    const formJson = Object.fromEntries(htmlFormData.entries());

    fetch('/api/tag', {
      method: 'POST',
      headers:  { "content-type": "application/json" },
      body: JSON.stringify(formJson),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<TagType>;
    })
    .then((tag: TagType) => {
      fetch('/api/tag_tree').then((res) => res.json()).then((rootTag) => setRootTag(rootTag));
      // Close the modal after successful update.
      setShowNewTagModal(false);
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  }

  function handleDeleteTagClick(tag: TagType) {
    setSelectedTag(tag);
    setShowDeleteTagModal(true);
  }  

  function handleMenuItemEditModalConfirm({ id, image }: MenuItemFormData) {
    if (!image) {
      console.log("Empty image");
      return;
    }

    const htmlFormData = new FormData();
    htmlFormData.append("image", image!);
    htmlFormData.append("menu_item_id", id.toString());

    fetch('/api/menu_item_image_upload', {
      method: 'POST',
      body: htmlFormData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<MenuItemType>;
    })
    .then((menu_item: MenuItemType) => {
      setRestaurantData(prevRestaurantData => {
        // Update only if defined.
        if (prevRestaurantData) {
          return {
            ...prevRestaurantData,
            menu_items: prevRestaurantData.menu_items.map(item =>
              item.id === menu_item.id ? menu_item : item
            )
          };
        }
        // If prevRestaurantData is undefined, return the current state (which is also undefined)
        return prevRestaurantData;
      });
      // Close the modal after successful update.
      setShowMenuItemModal(false);
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  }

  async function handleDeleteTag(tag: TagType) {
    await fetch(
      `/api/tag/${tag.id}`,
      {
        method: 'delete',
        headers: { "content-type": "application/json" },
      });

    setShowDeleteTagModal(false);
    fetch('/api/tag_tree').then((res) => res.json()).then((rootTag) => setRootTag(rootTag));
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
            { rootTag && <TagCategory rootTag={rootTag} onAddTag={handleAddTag} onDeleteTag={handleDeleteTagClick}/> }
          </div>
        </div>
        <Modal
          className={styles.modal}
          show={showNewTagModal}
          onHide={() => setShowNewTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowNewTagModal(false))}
        >
          <NewTagForm handlePostSubmit={handlePostTagSubmit} parentTag={selectedTag!} />
        </Modal>
        <Modal
          className={styles.modal}
          show={showDeleteTagModal}
          onHide={() => setShowDeleteTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowDeleteTagModal(false))}
        >
          <ConfirmationModal
            text={`Delete tag ${selectedTag?.name}?`}
            onConfirm={() => handleDeleteTag(selectedTag!)}
            onCancel={() => setShowDeleteTagModal(false)}
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