'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, Restaurant as RestaurantType, MenuItem as MenuItemType } from "@/app/types/menu";
import TagComponent from "@/app/components/shared/tag.component"
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";
import Modal from 'react-overlays/Modal';
import NewTagForm from "./new_tag_form.component";
import ConfirmationModal from "../shared/confirmation_modal.component";

export default function Restaurant() {
  const [restaurantData, setRestaurantData] = useState<RestaurantType>();
  const [tags, setTags] = useState<TagType[]>([]);
  const searchParams = useSearchParams();
  const { restaurant_name = "", menu_items = [] } = restaurantData || {};
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  const [showDeleteTagModal, setShowDeleteTagModal] = useState<boolean>(false);

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

  function Backdrop() {
    return (
      <div
        className={styles.backdrop}
        onClick={() => setShowTagModal(false)}
      />
    )
  }

  function handleAddTag() {
    setShowTagModal(true);
  }

  function handleDeleteTag() {
    setShowDeleteTagModal(true);
  }

  function handlePostTagSubmit() {
    setShowTagModal(false);
    fetch('/api/tags').then((res) => res.json()).then((tags) => setTags(tags));
  }

  function handlePostTagDelete() {
    setShowDeleteTagModal(false);
    fetch('/api/tags').then((res) => res.json()).then((tags) => setTags(tags));
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
                <MenuItem key={menu_item.id} {...menu_item} />
              ))
            }
          </div>
        </div>
        <div className={styles.tags}>
          <div className={styles.title}>Tags</div>
          <div className={styles.taglist}>
            {
              tags.map((tag: TagType) => (
                <TagComponent key={tag.id} deletable={true} tag={tag} onDelete={handleDeleteTag}/>
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
          renderBackdrop={Backdrop}
        >
          <NewTagForm handlePostSubmit={handlePostTagSubmit}/>
        </Modal>
        <Modal
          className={styles.modal}
          show={showDeleteTagModal}
          onHide={() => setShowDeleteTagModal(false)}
          renderBackdrop={Backdrop}
        >
          <ConfirmationModal
            text={"Delete tag?"}
            onConfirm={handlePostTagDelete}
            onCancel={() => setShowDeleteTagModal(false)}
          />
        </Modal>
      </div>
    </div>
  )
}