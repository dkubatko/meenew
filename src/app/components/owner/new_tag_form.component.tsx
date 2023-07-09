import { SyntheticEvent, useState } from "react";
import styles from "@/app/components/owner/new_tag_form.module.css";

type TagData = {
  name: string
}

export default function NewTagForm() {
  const [tagData, setTagData] = useState<TagData>();

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    fetch(
      '/api/tag',
      { 
        method: form.method, 
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formJson),
      }).then((res) => console.log(res));
  }

  return (
    <form method="post" onSubmit={handleSubmit} className={styles.form}>
      <label>
        Name: <input name="name" className={styles.inp} autoComplete="off"/>
      </label>
      <button type="submit" className={styles.submit}>Add</button>
    </form>
  )
}