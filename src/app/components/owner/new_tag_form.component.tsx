import { useState } from "react";
import styles from "@/app/components/owner/new_tag_form.module.css";
import { ThreeDots } from "react-loader-spinner";
import { TagCreate, Tag as TagType } from "@/app/types/menu";

type TagData = {
  name: string
}

interface NewTagFormPropsType {
  parentTag: TagType;
  handlePostSubmit: (tag: TagCreate) => void;
}

export default function NewTagForm({ handlePostSubmit, parentTag }: NewTagFormPropsType) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  function handleSubmit() {
    setSubmitting(true);
    const tag: TagCreate = { name: name, parent_id: parentTag.id };
    handlePostSubmit(tag);
  }

  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
        Adding under category  &quot;{parentTag.name}&quot;
      </div>
      <div className={styles.form}>
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
        <button onClick={handleSubmit} className={styles.submit}>Add</button>
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