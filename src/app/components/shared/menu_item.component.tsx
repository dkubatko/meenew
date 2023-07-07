import styles from "@/app/components/shared/menu_item.module.css";
import { Tag, MenuItem as MenuItemType } from "@/app/types/menu";

export default function MenuItem({ item_name, tags }: MenuItemType) {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.image}>
          Image
        </div>
        <div className={styles.content}>
          <div className={styles.name}>{item_name}</div>
          <div className={styles.description}>Description</div>
        </div>
      </div>
    </div>
  )
}