import styles from '@/app/components/shared/image_upload.module.css';

interface ImageUploadProps {
  onUpload: () => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  return (
    <div className={styles.container}>
      <div className={styles.dropbox}>
        Drop files here
      </div>
      <div
        className={styles.upload}
        onClick={onUpload}
      >
        Upload
      </div>
    </div>
  )
}