import { MenuItem } from "@/app/types/menu"
import ImageUpload from "../shared/image_upload.component";
import styles from './menu_item_modal.module.css';
import sharedStyles from '@/app/components/shared/shared.module.css';
import { Tag as TagType } from "@/app/types/menu";
import Tag from "../shared/tag.component";

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
        <label style={{'flex': '1'}}>
          Item name:<br/>
          <input 
            type="text" 
            name="item_name" 
            className={styles.textInput}
            value={menu_item?.item_name}
          />
        </label>
        <label style={{'flex': '2'}}>
          Tags:
          <div className={styles.tagsContainer}>
          {
            menu_item?.tags.map(
              (tag: TagType) => <Tag key={tag.id} tag={tag} className={sharedStyles.smallTag}/>
            )
          }
          </div>
        </label>
      </div>
    </div>
  )
}