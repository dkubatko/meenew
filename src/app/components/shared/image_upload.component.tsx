import styles from '@/app/components/shared/image_upload.module.css';
import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageUrl: string;
}

export default function ImageUpload({ onImageUpload, imageUrl }: ImageUploadProps) {
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
          {/* <div className={styles.clearButton} onClick={clearFile}>Clear</div> */}
        </div>
      }
    </div>
  )
}