import styles from '@/app/components/shared/imageUpload.module.css';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClear?: () => void;
  imageUrl: string | null;
}

export default function ImageUpload({ onImageUpload, onImageClear, imageUrl }: ImageUploadProps) {
  return (
    <div className={styles.container}>
      { !imageUrl &&
        <label className={styles.dropbox}>
          <input type="file" onChange={onImageUpload} accept=".jpg, .jpeg, .png"/>
          Upload image
      </label>
      }
      {
        imageUrl && <div className={styles.previewContainer}>
          <div className={styles.preview}>
            <Image src={imageUrl} alt={'preview'} fill style={{objectFit: 'contain'}}/>
          </div> 
          <div className={styles.clearButton} onClick={onImageClear}>Clear</div>
        </div>
      }
    </div>
  )
}