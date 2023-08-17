import styles from "@/app/components/owner/tagModal.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import { Tag } from "@/app/types/tag";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";


interface TagModalProps {
  tag: Tag;
  onConfirm: (tag: Tag) => void;
  onCancel: () => void;
  onDelete?: (tag: Tag) => void;
  isAdd?: boolean;
}

export default function TagModal({ tag, onConfirm, onCancel, onDelete, isAdd = false }: TagModalProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<Tag>(tag);

  function handleSubmit(is_delete: boolean) {
    // Update tag with the changes in the form.
    setSubmitting(true);
    const tag = Tag.fromObject(formData);
    is_delete ? onDelete!(tag) : onConfirm(tag);
  }

  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
          { isAdd ? 'Add new tag' : `Edit tag "${tag.name}"` }
        </div>
      <div className={styles.form}>
        <div className={styles.inputSection}>
          <div className={styles.inputLabel}>Name:</div>
          <input 
            value={formData.name}
            onInput={
              (e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData((formData: Tag) => ({...formData, name: e.target.value}))
            }
            className={sharedStyles.textInput} 
            autoComplete="off"
          />
        </div>
      </div>
      <div className={styles.control}>
          { !isAdd && <button onClick={() => handleSubmit(true)} className={sharedStyles.deleteButton}>Delete</button> }
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