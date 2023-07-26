'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, Restaurant as RestaurantType, MenuItem as MenuItemType, Tag } from "@/app/types/menu";
import TagComponent from "@/app/components/shared/tag.component"
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";
import Modal from 'react-overlays/Modal';
import NewTagForm from "./new_tag_form.component";
import ConfirmationModal from "../shared/confirmation_modal.component";
import MenuItemModal from "./menu_item_modal.component";

export default function Restaurant() {
  const [restaurantData, setRestaurantData] = useState<RestaurantType>();
  const [tags, setTags] = useState<TagType[]>([]);
  const searchParams = useSearchParams();
  const { restaurant_name = "", menu_items = [] } = restaurantData || {};
  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  const [showDeleteTagModal, setShowDeleteTagModal] = useState<boolean>(false);
  const [showMenuItemModal, setShowMenuItemModal] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>();

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurant/${searchParams.get('id') ?? '0'}`),
      fetch('/api/tags'),
    ])
      .then(([resRestaurant, resTags]) =>
        Promise.all([resRestaurant.json(), resTags.json()])
      )
      .then(([restaurant, tags]) => {
        setRestaurantData(restaurant);
        setTags(tags);
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

  function handleAddTag() {
    setShowTagModal(true);
  }

  function handleDeleteTagClick(tag: TagType) {
    setSelectedTag(tag);
    setShowDeleteTagModal(true);
  }

  function handlePostTagSubmit() {
    setShowTagModal(false);
    fetch('/api/tags').then((res) => res.json()).then((tags) => setTags(tags));
  }

  async function handleDeleteTag(tag: TagType) {
    await fetch(
      `/api/tag/${tag.id}`,
      {
        method: 'delete',
        headers: { "content-type": "application/json" },
      });

    setShowDeleteTagModal(false);
    fetch('/api/tags').then((res) => res.json()).then((tags) => setTags(tags));
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
            {
              tags.map((tag: TagType) => (
                <TagComponent
                  key={tag.id}
                  deletable={true}
                  tag={tag}
                  onDelete={() => handleDeleteTagClick(tag)}
                />
              ))
            }
          </div>
          <button
            className={styles.add}
            onClick={() => handleAddTag()}
          >
            +
          </button>
        </div>
        <Modal
          className={styles.modal}
          show={showTagModal}
          onHide={() => setShowTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowTagModal(false))}
        >
          <NewTagForm handlePostSubmit={handlePostTagSubmit} />
        </Modal>
        <Modal
          className={styles.modal}
          show={showDeleteTagModal}
          onHide={() => setShowDeleteTagModal(false)}
          renderBackdrop={() => Backdrop(() => setShowDeleteTagModal(false))}
        >
          <ConfirmationModal
            text={`Delete tag ${selectedTag?.name}?"`}
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
            onConfirm={() => console.log('Menu item modal confirm.')}
            menu_item={selectedMenuItem}
            edit={true}
          />
        </Modal>
      </div>
    </div>
  )
}