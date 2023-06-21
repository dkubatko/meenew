import { motion } from "framer-motion";
import styles from '@/app/components/options.module.css';
import { useRef } from 'react';

const containerVariants = {
  hidden: { scale: 1 },
  show: {
      scale: 1,
      transition: {
          staggerChildren: 0.25,
      }
  },
  hover: { scale: 1 }
};

const optionVariants = {
  hidden: { scale: 0 },
  show: {
      scale: 1,
  },
  hover: { scale: 1.3 }
};

// TODO: Type props properly.
type ClickHandler = (option: string) => void;

export default function Options({ question, handleAnswerClick} : { question: any, handleAnswerClick: ClickHandler}) {
  const optionsDiv = useRef<HTMLDivElement>(null);

  function circularTranslate(index: number, total: number) {
    let maxMargin = (optionsDiv.current?.clientHeight || 150) / 2;
    let mid_index = (total - 1) / 2;
    let k = maxMargin / Math.pow(mid_index, 2);
    let offset = k * Math.pow(index - mid_index, 2)

    return offset;
  }

  return (
    <motion.div 
          className={styles.hflex} 
          ref={optionsDiv}
          initial="hidden"
          animate="show"
          variants={containerVariants}
          key={question.id}
        >
          {
            question.answer_options.map(
              (option: any, index: number) => (
                <motion.div
                  variants={optionVariants}
                  whileTap={{ scale: 0.97 }}
                  className={styles.option}
                  style={
                    {
                      marginTop: `${circularTranslate(index, question.answer_options.length)}px`
                    }
                  }
                  onClick={_ => handleAnswerClick(option)}
                  key={option.id}>
                  {option.text}
                </motion.div>
              )
            )
          }
        </motion.div>
  )
}