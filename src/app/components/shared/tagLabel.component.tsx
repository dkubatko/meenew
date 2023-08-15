import { TagLabel as TagLabelType, Tag as TagType } from "@/app/types/tag";
import styles from "@/app/components/shared/tagLabel.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import editIcon from "@/assets/icons/pencil-edit.svg";
import { useState } from "react";
import Tag from "./tag.component";
import Image from "next/image";

interface TagLabelProps {
  tagLabel: TagLabelType;
  onAddTag?: (tagLabel: TagLabelType) => void;
  onEditTagLabel?: (tagLabel: TagLabelType) => void;
  onEditTag?: (tag: TagType) => void;
}

export default function TagLabel({ tagLabel, onAddTag, onEditTagLabel, onEditTag }: TagLabelProps) {
  const [expand, setExpand] = useState<Boolean>();

  return (
    <>
      <div className={styles.container} onClick={() => setExpand(!expand)}>
        <div className={styles.triangle} />
        <div className={styles.title}>
          {tagLabel.name}
        </div>
        {
            onEditTagLabel &&
            <div
              className={sharedStyles.cornerControl}
              onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                event.stopPropagation();
                onEditTagLabel(tagLabel);
              }}
            >
              <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
            </div>
          }
      </div>
      <div className={styles.items}>
        <div className={styles.separator} />
        <div className={styles.subtags}>
          {
            expand &&
            tagLabel.tags?.map((subTag: TagType) =>
                <Tag key={subTag.id} tag={subTag} onEdit={onEditTag} className={sharedStyles.largeTag}/>)
          }
          {
            expand && onAddTag &&
            <button
              className={sharedStyles.addButton}
              onClick={() => onAddTag(tagLabel)}
            >
              +
            </button>
          }
        </div>
      </div>
    </>
  )
}