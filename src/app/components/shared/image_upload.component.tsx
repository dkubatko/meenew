import styles from '@/app/components/shared/image_upload.module.css';
import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: () => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [file, setFile] = useState<any>();

  function onFileUpload(e: any) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  function clearFile() {
    setFile(null);
  }

  return (
    <div className={styles.container}>
      { !file &&
        <label className={styles.dropbox}>
          <input type="file" onChange={onFileUpload}/>
          Upload image
      </label>
      }
      {
        file && <div className={styles.previewContainer}>
          <div className={styles.preview}>
            <Image src={file} alt={'preview'} fill style={{objectFit: 'contain'}}/>
          </div> 
          <div className={styles.clearButton} onClick={clearFile}>Clear</div>
        </div>
      }
      {
        file && 
        <div
          className={styles.upload}
          onClick={onUpload}
        >
          Upload
        </div>
      }
    </div>
  )
}