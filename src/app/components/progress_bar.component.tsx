import styles from './progress_bar.module.css';
import { motion } from 'framer-motion';

type ProgressBarProps = {
  progressPercent: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.filling}
        initial={{ width: '0%' }}
        animate={{
          width: `${props.progressPercent}%`
        }}
      />
    </div>
  )
}