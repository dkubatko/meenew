import styles from "@/app/components/shared/menu_item.module.css";
import sharedStyles from '@/app/components/shared/shared.module.css';
import { Tag as TagType, MenuItem as MenuItemType } from "@/app/types/menu";
import Tag from "./tag.component";

interface MenuItemProps {
  menu_item: MenuItemType;
  editable?: boolean;
  onEdit?: () => void;
}

export default function MenuItem({menu_item: { item_name, tags }, editable, onEdit }: MenuItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.image}>
          Image
        </div>
        <div className={styles.content}>
          <div className={styles.name}>{item_name}</div>
          <div className={styles.tags}>
            {
              tags.map((tag: TagType) => (
                <Tag 
                  key={tag.id}
                  deletable={false} 
                  tag={tag}
                  className={sharedStyles.tag}
                />
              ))
            }
          </div>
        </div>
      </div>
      {
        editable && <div className={styles.edit} onClick={onEdit}>Edit</div>
      }
    </div>
  )
}