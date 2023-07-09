'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, Restaurant as RestaurantType, MenuItem as MenuItemType } from "@/app/types/menu";
import TagComponent from "@/app/components/shared/tag.component"
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";
import Modal from 'react-overlays/Modal';
import NewTagForm from "./new_tag_form.component";

interface RestaurantProps {
  tags: TagType[]
}

export default function Restaurant({ tags }: RestaurantProps) {
  const [restaurantData, setRestaurantData] = useState<RestaurantType>();
  const searchParams = useSearchParams();
  const { restaurant_name = "", menu_items = [] } = restaurantData || {};
  const [showTagModal, setShowTagModal] = useState<boolean>(false);
  
  useEffect(() => {
    fetch(`/api/restaurant/${searchParams.get('id') ?? '0'}`)
      .then((res) => res.json())
      .then((data: RestaurantType) => {
        setRestaurantData(data);
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

  return (
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
              <TagComponent key={tag.id} {...tag} />
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
        <div>
          <NewTagForm/>
        </div>
      </Modal>
    </div>
  )
}