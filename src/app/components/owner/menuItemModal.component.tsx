import ImageUpload from "../shared/imageUpload.component";
import styles from './menuItemModal.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';
import MenuItem from "@/app/types/menuItem";
import { Tag as TagType } from "@/app/types/tag";
import Tag from "../shared/tag.component";
import { useState } from "react";
import AddInputButton from "../shared/addInputButton.component";

interface MenuItemModalProps {
  onCancel: () => void;
  onConfirm: (formData: MenuItemFormData) => void;
  onDelete?: (menuItem: MenuItem) => void;
  menu_item: MenuItem;
  tagList: TagType[];
  edit?: boolean;
}

export interface MenuItemFormData {
  menu_item: MenuItem;
  image: File | null;
}

export default function MenuItemModal({ onCancel, onConfirm, menu_item, edit, tagList, onDelete }: MenuItemModalProps) {
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

  const handleNewTagSubmit = (tagId: number) => {
    const selectedTag = tagList.find(tag => tag.id === tagId);

    if (selectedTag) {
      setFormData(formData => ({
        ...formData,
        menu_item: {
          ...formData.menu_item,
          tags: [...formData.menu_item.tags, selectedTag],
        },
      }));
    } else {
      console.log("Tag doesn't exist.");
    }
  };

  const handleDeleteTag = (tagToDelete: TagType) => {
    setFormData(formData => ({
      ...formData,
      menu_item: {
        ...formData.menu_item,
        tags: formData.menu_item.tags.filter(tag => tag.id !== tagToDelete.id),
      },
    }));
  };

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
          <div className={styles.nameSection}>
            <div className={styles.sectionTitle}>Item name:</div>
            <input
              value={formData.menu_item.item_name}
              onInput={
                (e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedItem = { ...formData.menu_item, item_name: e.target.value };
                  setFormData({ ...formData, menu_item: updatedItem });
                }
              }
              className={sharedStyles.textInput}
              autoComplete="off"
            />
          </div>
          <div className={styles.tagSection}>
            <div className={styles.sectionTitle}>Tags:</div>
            <div className={styles.tagsContainer}>
              {
                formData.menu_item.tags.map(
                  (tag: TagType) =>
                    <Tag
                      key={tag.id}
                      tag={tag}
                      onEdit={handleDeleteTag}
                      className={sharedStyles.smallTag}
                    />
                )
              }
              <AddInputButton
                onSubmit={handleNewTagSubmit}
                options={tagList.map((tag: TagType) => ({ id: tag.id, value: tag.name }))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.control}>
        {edit && <button
          className={sharedStyles.deleteButton}
          onClick={() => onDelete!(menu_item)}>
          Delete
        </button>}
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