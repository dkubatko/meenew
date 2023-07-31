import { MenuItem } from "@/app/types/menu"
import ImageUpload from "../shared/image_upload.component";
import styles from './menu_item_modal.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';
import { Tag as TagType } from "@/app/types/menu";
import Tag from "../shared/tag.component";
import { useState } from "react";

interface MenuItemModalProps {
  onCancel: () => void;
  onConfirm: (formData: MenuItemFormData) => void;
  menu_item: MenuItem;
  edit?: boolean;
}

export interface MenuItemFormData {
  menu_item: MenuItem;
  image: File | null;
}

export default function MenuItemModal({ onCancel, onConfirm, menu_item, edit }: MenuItemModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(menu_item?.image_path!);
  const [formData, setFormData] = useState<MenuItemFormData>({
    menu_item: menu_item,
    image: null
  });

  function onImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.target.files![0];

    // Update image_path to display the temporary image
    // and preserve the image object for further upload.
    setFormData(formData => ({
      ...formData,
      image: image,
      menu_item: {
        ...formData.menu_item,
        image_path: URL.createObjectURL(image),
      }
    }));
  }

  function onImageClear() {
    setFormData(formData => ({
      ...formData,
      menu_item: {
        ...formData.menu_item,
        image_path: ""
      }
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.imageContainer}>
          <ImageUpload
            onImageUpload={onImageUpload}
            imageUrl={formData.menu_item.image_path}
            onImageClear={onImageClear}
          />
        </div>
        <div className={styles.inputsContainer}>
          <label style={{ 'flex': '1' }}>
            Item name:<br />
            <input
              value={formData.menu_item.item_name}
              onInput={
                (e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedItem = { ...formData.menu_item, item_name: e.target.value };
                  setFormData({ ...formData, menu_item: updatedItem });
                }
              }
              className={styles.textInput}
              autoComplete="off"
            />
          </label>
          <label style={{ 'flex': '2' }}>
            Tags:
            <div className={styles.tagsContainer}>
              {
                menu_item?.tags.map(
                  (tag: TagType) => <Tag key={tag.id} tag={tag} className={sharedStyles.smallTag} />
                )
              }
            </div>
          </label>
        </div>
      </div>
      <div className={styles.footer}>
        <div
          className={sharedStyles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </div>
        <div
          className={sharedStyles.confirmButton}
          onClick={() => onConfirm(formData)}
        >
          {edit ? "Update" : "Add"}
        </div>
      </div>
    </div>
  )
}