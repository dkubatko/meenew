import styles from "@/app/components/results.module.css";

export default function Results() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Your best match:</div>
      <div className={styles.item}>
        <div className={styles.image}>
          Image
        </div>
        <div className={styles.content}>
          <div className={styles.name}>Kang Puo Kao</div>
          <div className={styles.description}>Description</div>
        </div>
      </div>
    </div>
  )  
}