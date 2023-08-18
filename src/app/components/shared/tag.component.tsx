import { Tag as TagType } from "@/app/types/tag";
import styles from "@/app/components/shared/tag.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import { motion } from "framer-motion";
import editIcon from "@/assets/icons/pencil-edit.svg";
import Image from "next/image";
import { useState } from "react";
import Modal from 'react-overlays/Modal';
import TagModal from "@/app/components/owner/tagModal.component";
import Backdrop from "@/app/util/backdrop";
import { ServerAPIClient } from "@/app/api/APIClient";

interface TagProps {
  tag: TagType;
  postEditTag?: (updatedTag: TagType) => void;
  postDeleteTag?: (deletedTag: TagType) => void;
  handleRemove?: (tagToRemove: TagType) => void;
  className?: string;
  removable?: boolean;
  editable?: boolean;
}

export default function Tag({
  tag,
  postEditTag,
  postDeleteTag,
  handleRemove,
  className,
  editable = false,
  removable = false,
}: TagProps) {
  const [currentTag, setCurrentTag] = useState<TagType>(tag);
  const [showEditTagModal, setShowEditTagModal] = useState<boolean>(false);

  async function handleEditTag(tag: TagType) {
    const updatedTag = await ServerAPIClient.Tag.update(tag);

    if (!updatedTag) {
      console.error('An error occurred while updating a tag');
      return;
    }

    setCurrentTag(updatedTag);

    // Propagate update upwards.
    postEditTag && postEditTag(updatedTag);

    // Close the modal after successful update.
    setShowEditTagModal(false);
  }

  async function handleDeleteTag(tag: TagType) {
    const result = await ServerAPIClient.Tag.delete(tag.id);

    if (!result || !result.ok) {
      console.error('An error occurred while deleting a tag');
      return;
    }

    // Propagate update upwards.
    postDeleteTag && postDeleteTag(currentTag);

    // Close the modal after successful update.
    setShowEditTagModal(false);
  }

  return (
    <>
      <motion.div
        id={currentTag.id.toString()}
        className={className || styles.tag}
      >
        {
          editable &&
          <div
            className={sharedStyles.cornerControl}
            onClick={() => setShowEditTagModal(true)}
          >
            <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
          </div>
        }
        {
          removable && handleRemove &&
          <div
            className={sharedStyles.cornerControl}
            onClick={() => handleRemove(currentTag)}
          >
            <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
          </div>
        }
        {tag.name}
      </motion.div>
      <Modal
        className={sharedStyles.modal}
        show={showEditTagModal}
        onHide={() => setShowEditTagModal(false)}
        renderBackdrop={() => Backdrop(() => setShowEditTagModal(false))}
      >
        <TagModal
          tag={tag}
          onConfirm={handleEditTag}
          onDelete={handleDeleteTag}
          onCancel={() => setShowEditTagModal(false)}
          isAdd={false}
        />
      </Modal>
    </>
  )
}