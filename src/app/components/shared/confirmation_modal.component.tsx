import styles from "@/app/components/shared/confirmation_modal.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";

interface ConfirmationModalProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ text, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className={styles.container}>
      <div className={styles.text}>{text}</div>
      <div className={styles.control}>
        <div
          className={`${styles.confirm} ${sharedStyles.btn}`}
          onClick={onConfirm}
        >
          Confirm
        </div>
        <div 
          className={`${styles.cancel} ${sharedStyles.btn}`}
          onClick={onCancel}
        >
          Cancel
        </div>
      </div>
      
    </div>
  )
}