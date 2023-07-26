import { MenuItem } from "@/app/types/menu"
import ImageUpload from "../shared/image_upload.component";
import styles from './menu_item_modal.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';
import { Tag as TagType } from "@/app/types/menu";
import Tag from "../shared/tag.component";
import { useState } from "react";

interface MenuItemModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  menu_item?: MenuItem;
  edit?: boolean;
}

interface ImageUploadResponse {
  image_url: string;
}

export default function MenuItemModal({ onCancel, onConfirm, menu_item, edit }: MenuItemModalProps) {
  const [imageUrl, setImageUrl] = useState<string>(menu_item?.image_path!);

  function onImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.target.files![0];

    const formData = new FormData();
    formData.append("image", image);

    fetch('/api/menu_item_image_upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<ImageUploadResponse>;
    })
    .then(data => {
      setImageUrl(data.image_url);
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.imageContainer}>
          {
            edit ?
              (
                <ImageUpload onImageUpload={onImageUpload} imageUrl={imageUrl}/>
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
          onClick={onConfirm}
        >
            Update
        </div>
      </div>
    </div>
  )
}