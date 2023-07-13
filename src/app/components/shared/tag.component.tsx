import { Tag as TagType } from "@/app/types/menu";
import styles from "@/app/components/shared/tag.module.css";
import { motion } from "framer-motion";

interface TagProps {
  deletable: boolean;
  onDelete?: () => void;
  tag: TagType;
}

export default function Tag({ deletable = false, onDelete, tag: { id, name } }: TagProps) {
  return (
    <motion.div
      id={id.toString()}
      className={styles.tag}
    >
      {
        deletable &&
        <div
          className={styles.remove}
          onClick={onDelete}
        >
          X
        </div>
      }
      {name}
    </motion.div>
  )
}