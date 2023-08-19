import styles from "@/app/components/owner/tagOrLabelModal.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import { Tag, TagLabel } from "@/app/types/tag";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";


interface TagOrLabelModalProps<T extends Tag | TagLabel> {
  tagOrLabel: T;
  onConfirm: (item: T) => void;
  onCancel: () => void;
  onDelete?: (item: T) => void;
  isAdd?: boolean;
}

export default function TagOrLabelModal<T extends Tag | TagLabel>({
  tagOrLabel,
  onConfirm,
  onCancel,
  onDelete,
  isAdd = false }: TagOrLabelModalProps<T>) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<T>(tagOrLabel);

  function isTagLabel(tagOrLabel: Tag | TagLabel): tagOrLabel is TagLabel {
    // Checks if label_id exists on the passed object, verifying its type.
    return !!!(tagOrLabel as Tag).label_id;
  }

  function handleSubmit(is_delete: boolean) {
    // Update tag with the changes in the form.
    setSubmitting(true);
    let updatedTagOrLabel: T;

    if (formData instanceof Tag) {
      updatedTagOrLabel = Tag.fromObject(formData) as T;
    } else {
      updatedTagOrLabel = TagLabel.fromObject(formData) as T;
    }

    is_delete ? onDelete!(updatedTagOrLabel) : onConfirm(updatedTagOrLabel);
  }

  console.log(tagOrLabel instanceof TagLabel);

  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
        {isAdd
          ? (isTagLabel(tagOrLabel) ? 'Add new tag label' : 'Add new tag')
          : (isTagLabel(tagOrLabel) ? `Edit tag label "${tagOrLabel.name}"` : `Edit tag "${tagOrLabel.name}"`)
        }

      </div>
      <div className={styles.form}>
        <div className={styles.inputSection}>
          <div className={styles.inputLabel}>Name:</div>
          <input
            value={formData.name}
            onInput={
              (e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((formData: T) => ({ ...formData, name: e.target.value }))
            }
            className={sharedStyles.textInput}
            autoComplete="off"
          />
        </div>
      </div>
      <div className={styles.control}>
        {!isAdd && <button onClick={() => handleSubmit(true)} className={sharedStyles.deleteButton}>Delete</button>}
        <button onClick={() => onCancel()} className={sharedStyles.cancelButton}>Cancel</button>
        <button onClick={() => handleSubmit(false)} className={sharedStyles.confirmButton}>Apply</button>
      </div>
      <ThreeDots
        height="1vh"
        width="200"
        radius="7"
        color="#ff9d1b"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={submitting}
      />
    </div>
  )
}