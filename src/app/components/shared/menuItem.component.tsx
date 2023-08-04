import styles from "@/app/components/shared/menuItem.module.css";
import sharedStyles from '@/app/components/shared/shared.module.css';
import { Tag as TagType } from "@/app/types/tag";
import MenuItemType from "@/app/types/menuItem";
import Tag from "./tag.component";
import Image from 'next/image';
import editIcon from "@/assets/icons/pencil-edit.svg";

interface MenuItemProps {
  menu_item: MenuItemType;
  editable?: boolean;
  onEdit?: () => void;
}

export default function MenuItem({menu_item: { item_name, tags, image_path }, editable, onEdit }: MenuItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.image}>
          {
            image_path ? 
            <Image src={image_path} alt={'preview'} fill style={{objectFit: 'contain'}}/> : "Image"
          }
        </div>
        <div className={styles.content}>
          <div className={styles.name}>{item_name}</div>
          <div className={styles.tags}>
            {
              tags.map((tag: TagType) => (
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
        editable && <div className={`${sharedStyles.cornerControl} ${styles.small}`} onClick={onEdit}>
          <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
        </div>
      }
    </div>
  )
}