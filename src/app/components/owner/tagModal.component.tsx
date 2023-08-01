import styles from "@/app/components/owner/tagModal.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import { Tag } from "@/app/types/tag";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";


interface TagModalProps {
  tag: Tag;
  onConfirm: (tag: Tag) => void;
  onCancel: () => void;
  onDelete: (tag: Tag) => void;
}

export default function TagModal({ tag, onConfirm, onCancel, onDelete }: TagModalProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [name, setName] = useState<string>(tag.name);
  const [isCategory, setIsCategory] = useState<boolean>(!tag.is_leaf);

  function handleSubmit(is_delete: boolean) {
    // Update tag with the changes in the form.
    tag.is_leaf = !isCategory;
    tag.name = name;
    setSubmitting(true);
    is_delete ? onDelete(tag) : onConfirm(tag);
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.prompt}>
          Edit {tag.name}
        </div>
        <label>
          Name: 
          <input 
            value={name} 
            onInput={
              (e: React.ChangeEvent<HTMLInputElement>) => 
                setName(e.target.value)
            } 
            className={styles.inp} 
            autoComplete="off"
          />
        </label>
        <label>
          Category:
          <input
            type="checkbox"
            checked={isCategory}
            onChange={() => setIsCategory(!isCategory)}
          />
        </label>
        <div className={styles.control}>
          <button onClick={() => handleSubmit(true)} className={sharedStyles.deleteButton}>Delete</button>
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
    </div>
  )
}