import { MenuItem } from "@/app/types/menu"
import ImageUpload from "../shared/image_upload.component";
import styles from './menu_item_modal.module.css'

interface MenuItemModalProps {
  menu_item?: MenuItem;
  edit?: boolean;
}

export default function MenuItemModal({ menu_item, edit }: MenuItemModalProps) {
  function onImageUpload() {
    console.log("Image upload");
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.imageContainer}>
      {
        edit ? 
        (
          <ImageUpload onUpload={onImageUpload}></ImageUpload>
        ) :
        (
          <div>
            Image
          </div>
        )
      }
      </div>
      <div className={styles.inputsContainer}>
        <label>
          Item name:
          <input type="text" name="item_name" className={styles.textInput}/>
        </label>
        <label>
          Tags:
          A, B, c
        </label>
      </div>
    </div>
  )
}