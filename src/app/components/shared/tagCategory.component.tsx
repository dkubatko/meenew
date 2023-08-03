import { TagTree, Tag as TagType } from "@/app/types/tag";
import styles from "@/app/components/shared/tagCategory.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import editIcon from "@/assets/icons/pencil-edit.svg";
import { useState } from "react";
import Tag from "./tag.component";
import Image from "next/image";

interface TagCategoryProps {
  rootTag: TagTree;
  onAddTag?: (parent_tag: TagType) => void;
  onEditTag?: (tag: TagType) => void;
}

export default function TagCategory({ rootTag, onAddTag, onEditTag }: TagCategoryProps) {
  const [expand, setExpand] = useState<Boolean>();

  // TODO: Implement proper sorting
  rootTag.children?.sort((a, b) => Number(a.is_leaf) - Number(b.is_leaf));

  return (
    <>
      <div className={styles.container} onClick={() => setExpand(!expand)}>
        <div className={styles.triangle} />
        <div className={styles.title}>
          {rootTag.name}
        </div>
        {
            onEditTag &&
            <div
              className={sharedStyles.cornerControl}
              onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                event.stopPropagation();
                onEditTag(rootTag.toTagType());
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
            rootTag.children?.map((subTag: TagTree) =>
              subTag.is_leaf ?
                <Tag key={subTag.id} tag={subTag.toTagType()} onEdit={onEditTag} />
                :
                <TagCategory key={subTag.id} rootTag={subTag} onEditTag={onEditTag} onAddTag={onAddTag} />)
          }
          {
            expand && onAddTag &&
            <button
              className={sharedStyles.addButton}
              onClick={() => onAddTag(rootTag.toTagType())}
            >
              +
            </button>
          }
        </div>
      </div>

    </>
  )
}