import { useState } from "react";
import styles from "@/app/components/shared/menuItem.module.css";
import sharedStyles from '@/app/components/shared/shared.module.css';
import { Tag as TagType } from "@/app/types/tag";
import MenuItemType from "@/app/types/menuItem";
import MenuItemModal, { MenuItemFormData } from "@/app/components/owner/menuItemModal.component";
import Tag from "./tag.component";
import Image from 'next/image';
import editIcon from "@/assets/icons/pencil-edit.svg";
import Modal from 'react-overlays/Modal';
import Backdrop from "@/app/util/backdrop";
import { ServerAPIClient } from "@/app/api/APIClient";

interface MenuItemProps {
  menu_item: MenuItemType;
  tagList?: TagType[];
  editable?: boolean;
  postEdit?: (menu_item: MenuItemType) => void;
  postDelete?: (menu_item: MenuItemType) => void;
}

export default function MenuItem({ menu_item, editable, postEdit, postDelete, tagList = [] }: MenuItemProps) {
  const [showEditMenuItemModal, setShowEditMenuItemModal] = useState<boolean>(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItemType>(menu_item);

  async function handleEditMenuItem({ menu_item, image }: MenuItemFormData) {
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

    setCurrentMenuItem(updatedMenuItem);

    // Propagate update upwards.
    postEdit && postEdit(updatedMenuItem);

    setShowEditMenuItemModal(false);
  }

  async function handleDeleteMenuItem() {
    const result = await ServerAPIClient.MenuItem.delete(currentMenuItem.id);

    if (!result || !result.ok) {
      console.error('An error occurred while deleting a menu item');
      return;
    }

    // Propagate update upwards.
    postDelete && postDelete(currentMenuItem);

    setShowEditMenuItemModal(false);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.image}>
            {
              menu_item.image_path ?
                <Image
                  src={menu_item.image_path}
                  alt='preview'
                  fill
                  className={styles.imageInner}
                /> : "Image"
            }
          </div>
          <div className={styles.content}>
            <div className={styles.name}>{menu_item.item_name}</div>
            <div className={styles.tags}>
              {
                menu_item.tags.map((tag: TagType) => (
                  <Tag
                    key={tag.id}
                    tag={tag}
                    className={sharedStyles.tag}
                  />
                ))
              }
            </div>
          </div>
        </div>
        {
          editable &&
          <div
            className={`${sharedStyles.cornerControl} ${styles.small}`}
            onClick={() => setShowEditMenuItemModal(true)}
          >
            <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
          </div>
        }
      </div>
      <Modal
        className={sharedStyles.modal}
        show={showEditMenuItemModal}
        onHide={() => setShowEditMenuItemModal(false)}
        renderBackdrop={() => Backdrop(() => setShowEditMenuItemModal(false))}
      >
        <MenuItemModal
          onCancel={() => setShowEditMenuItemModal(false)}
          onConfirm={handleEditMenuItem}
          onDelete={handleDeleteMenuItem}
          menu_item={menu_item}
          tagList={tagList}
          edit={true}
        />
      </Modal>
    </>
  )
}