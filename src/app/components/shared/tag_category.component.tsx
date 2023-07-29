import { TagTree, Tag as TagType } from "@/app/types/menu";
import styles from "@/app/components/shared/tag_category.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import { useState } from "react";
import Tag from "./tag.component";

interface TagCategoryProps {
  rootTag: TagTree;
  onAddTag?: (tag: TagType) => void;
  onDeleteTag?: (tag: TagType) => void;
}

export default function TagCategory({ rootTag, onAddTag, onDeleteTag }: TagCategoryProps) {
  const [expand, setExpand] = useState<Boolean>();

  rootTag.children?.sort((a, b) => b.children?.length! - a.children?.length!);

  return (
    <>
      <div className={styles.container} onClick={() => setExpand(!expand)}>
        <div className={styles.triangle} />
        <div className={styles.title}>
          {rootTag.name}
        </div>
      </div>
      <div className={styles.items}>
        <div className={styles.separator} />
        <div className={styles.subtags}>
          {
            expand &&
            rootTag.children?.map((subTag: TagTree) =>
              subTag.children?.length == 0 ?
                <Tag key={subTag.id} tag={subTag} deletable={true} onDelete={onDeleteTag} />
                :
                <TagCategory key={subTag.id} rootTag={subTag} onDeleteTag={onDeleteTag} onAddTag={onAddTag} />)
          }
          {
            expand && onAddTag &&
            <button
              className={sharedStyles.addButton}
              onClick={() => onAddTag({ id: rootTag.id, name: rootTag.name })}
            >
              +
            </button>
          }
        </div>
      </div>

    </>
  )
}