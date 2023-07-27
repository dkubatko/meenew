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
  id: number;
  name: string;
  image: File | null;
}

export default function MenuItemModal({ onCancel, onConfirm, menu_item, edit }: MenuItemModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(menu_item?.image_path!);
  const [formData, setFormData] = useState<MenuItemFormData>({ 
    id: menu_item.id,
    name: menu_item?.item_name!,
    image: null 
  });

  function onImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.target.files![0];

    setImageUrl(URL.createObjectURL(image));
    setFormData(formData => ({
      ...formData,
      image: image
    }));
  }

  function onImageClear() {
    setImageUrl(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.imageContainer}>
          {
            edit ?
              (
                <ImageUpload 
                  onImageUpload={onImageUpload}
                  imageUrl={imageUrl}
                  onImageClear={onImageClear}
                />
              ) :
              (
                <div>
                  Image
                </div>
              )
          }
        </div>
        <div className={styles.inputsContainer}>
          <label style={{ 'flex': '1' }}>
            Item name:<br />
            <input
              type="text"
              name="item_name"
              className={styles.textInput}
              value={menu_item?.item_name}
              readOnly
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
            Update
        </div>
      </div>
    </div>
  )
}