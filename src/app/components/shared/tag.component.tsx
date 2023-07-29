import { Tag as TagType } from "@/app/types/menu";
import styles from "@/app/components/shared/tag.module.css";
import { motion } from "framer-motion";

interface TagProps {
  tag: TagType;
  deletable?: boolean;
  onDelete?: (tag: TagType) => void;
  className?: string;
}

export default function Tag({ 
  tag: { id, name },
  deletable, 
  onDelete,
  className
}: TagProps) {
  return (
    <motion.div
      id={id.toString()}
      className={className || styles.tag}
    >
      {
        deletable && onDelete &&
        <div
          className={styles.remove}
          onClick={() => onDelete({ id, name })}
        >
          X
        </div>
      }
      {name}
    </motion.div>
  )
}