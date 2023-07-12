import { Tag as TagType } from "@/app/types/menu";
import styles from "@/app/components/shared/tag.module.css";
import { motion } from "framer-motion";

export default function Tag({ id, name }: TagType) {
  return (
    <motion.div
      id={id.toString()}
      className={styles.tag}
      whileTap={{ scale: 0.97 }}
    >
      {name}
    </motion.div>
  )
}