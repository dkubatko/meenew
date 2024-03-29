import { TagLabel as TagLabelType, Tag as TagType } from "@/app/types/tag";
import styles from "@/app/components/shared/tagLabel.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import editIcon from "@/assets/icons/pencil-edit.svg";
import { useState } from "react";
import Tag from "./tag.component";
import Modal from 'react-overlays/Modal';
import TagModal from "@/app/components/owner/tagOrLabelModal.component";
import Image from "next/image";
import Backdrop from "@/app/util/backdrop";
import { ServerAPIClient } from "@/app/api/APIClient";
import InlineInputButton from "./inlineInputButton.component";

interface TagLabelProps {
  tagLabel: TagLabelType;
  onAddTag?: (tagLabel: TagLabelType) => void;
  postDeleteTagLabel?: (tagLabel: TagLabelType) => void;
  postAddTag?: (tag: TagType) => void;
  postEditTag?: (tag: TagType) => void;
  postDeleteTag?: (tag: TagType) => void;
}

export default function TagLabel({
  tagLabel,
  postDeleteTagLabel,
  postAddTag,
  postEditTag,
  postDeleteTag }: TagLabelProps) {
  const [expand, setExpand] = useState<Boolean>();
  const [currentTagLabel, setCurrentTagLabel] = useState<TagLabelType>(tagLabel);

  const [showEditTagLabelModal, setShowEditTagLabelModal] = useState<boolean>(false);
  const [showAddTagModal, setShowAddTagModal] = useState<boolean>(false);

  function handleEditTag(updatedTag: TagType) {
    setCurrentTagLabel(prevTagLabel => ({
      ...prevTagLabel,
      tags: prevTagLabel.tags.map(tag =>
        tag.id === updatedTag.id ? updatedTag : tag
      )
    }));

    // Propagate update upwards.
    postEditTag && postEditTag(updatedTag);

    setShowEditTagLabelModal(false);
  }

  function handleDeleteTag(deletedTag: TagType) {
    setCurrentTagLabel(prevTagLabel => ({
      ...prevTagLabel,
      tags: prevTagLabel.tags.filter(tag => tag.id !== deletedTag.id) // Exclude the tag with matching id
    }));

    // Propagate update upwards.
    postDeleteTag && postDeleteTag(deletedTag);

    setShowEditTagLabelModal(false);
  }

  async function handleAddTag(tag: TagType) {
    const createdTag = await ServerAPIClient.Tag.create(tag);

    if (!createdTag) {
      console.error('An error occurred while creating a tag');
      return;
    }

    setCurrentTagLabel(prevTagLabel => ({
      ...prevTagLabel,
      tags: [...prevTagLabel.tags, createdTag] // Add the newly created tag to the existing tags
    }));

    // Propagate update upwards.
    postAddTag && postAddTag(createdTag);

    setShowAddTagModal(false);
  }

  async function handleEditTagLabel(tagLabel: TagLabelType) {
    const updatedTagLabel = await ServerAPIClient.TagLabel.update(tagLabel);

    if (!updatedTagLabel) {
      console.error('An error occurred while updating a tag label');
      return;
    }

    setCurrentTagLabel(updatedTagLabel);

    // TODO: Propagate up to update menu items.

    setShowEditTagLabelModal(false);
  }

  async function handleDeleteTagLabel(tagLabel: TagLabelType) {
    const result = await ServerAPIClient.TagLabel.delete(tagLabel.id!);

    if (!result || !result.ok) {
      console.error('An error occurred while deleting a tag');
      return;
    }

    postDeleteTagLabel && postDeleteTagLabel(currentTagLabel);

    setShowEditTagLabelModal(false);
  }

  return (
    <>
      <div className={styles.container} onClick={() => setExpand(!expand)}>
        <div className={styles.triangle} />
        <div className={styles.title}>
          {currentTagLabel.name}
        </div>
        <div
          className={sharedStyles.cornerControl}
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            setShowEditTagLabelModal(true);
          }}
        >
          <Image src={editIcon} alt={"edit"} className={styles.icon}></Image>
        </div>
      </div>
      <div className={styles.items}>
        <div className={styles.separator} />
        <div className={styles.subtags}>
          {
            expand &&
            currentTagLabel.tags?.map((subTag: TagType) =>
              <Tag
                key={subTag.id}
                tag={subTag}
                postEditTag={handleEditTag}
                postDeleteTag={handleDeleteTag}
                className={sharedStyles.largeTag}
                editable={true}
              />)
          }
          {
            expand && postAddTag &&
            <InlineInputButton
              onSubmit={(name: string) => {
                const tag = TagType.new(currentTagLabel.id!);
                tag.name = name;
                handleAddTag(tag);
              }}
              className={sharedStyles.inputButton}
            >
              Add tag
            </InlineInputButton>
          }
        </div>
      </div>
      <Modal
        className={sharedStyles.modal}
        show={showEditTagLabelModal}
        onHide={() => setShowEditTagLabelModal(false)}
        renderBackdrop={() => Backdrop(() => setShowEditTagLabelModal(false))}
      >
        <TagModal<TagLabelType>
          tagOrLabel={currentTagLabel}
          onConfirm={handleEditTagLabel}
          onDelete={handleDeleteTagLabel}
          onCancel={() => setShowEditTagLabelModal(false)}
          isAdd={false}
        />
      </Modal>
      <Modal
        className={sharedStyles.modal}
        show={showAddTagModal}
        onHide={() => setShowAddTagModal(false)}
        renderBackdrop={() => Backdrop(() => setShowAddTagModal(false))}
      >
        <TagModal<TagType>
          tagOrLabel={TagType.new(currentTagLabel.id!)}
          onConfirm={handleAddTag}
          onCancel={() => setShowAddTagModal(false)}
          isAdd={true}
        />
      </Modal>
    </>
  )
}