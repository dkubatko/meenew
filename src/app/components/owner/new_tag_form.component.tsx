import { SyntheticEvent, useState } from "react";
import styles from "@/app/components/owner/new_tag_form.module.css";
import { ThreeDots } from "react-loader-spinner";

type TagData = {
  name: string
}

interface NewTagFormPropsType {
  handlePostSubmit: () => void;
}

export default function NewTagForm({ handlePostSubmit }: NewTagFormPropsType) {
  const [tagData, setTagData] = useState<TagData>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitting(true);

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
    
    setTimeout(() => {
      setSubmitting(false);
      handlePostSubmit();
    }, 1000);
  }

  return (
    <form method="post" onSubmit={handleSubmit} className={styles.form}>
      <label>
        Name: <input name="name" className={styles.inp} autoComplete="off"/>
      </label>
      <button type="submit" className={styles.submit}>Add</button>
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
    </form>
  )
}