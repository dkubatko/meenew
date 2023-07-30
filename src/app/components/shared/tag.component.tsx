import { Tag as TagType } from "@/app/types/menu";
import styles from "@/app/components/shared/tag.module.css";
import { motion } from "framer-motion";
import editIcon from "@/assets/icons/pencil-edit.svg";
import Image from "next/image";

interface TagProps {
  tag: TagType;
  onEdit?: (tag: TagType) => void;
  className?: string;
}

export default function Tag({ 
  tag,
  onEdit,
  className
}: TagProps) {
  return (
    <motion.div
      id={tag.id.toString()}
      className={className || styles.tag}
    >
      {
        onEdit &&
        <div
          className={styles.remove}
          onClick={() => onEdit(tag)}
        >
          <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
        </div>
      }
      {tag.name}
    </motion.div>
  )
}