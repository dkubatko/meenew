import { motion } from "framer-motion";
import styles from '@/app/components/user/options.module.css';
import { ThreeDots } from "react-loader-spinner";
import { useRef } from 'react';
import { Question } from "@/app/types/questionnaire";
import { Tag } from "@/app/types/tag";

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

interface OptionsProps {
  question: Question;
  handleAnswerClick: (question: Question) => void;
}
// TODO: Type props properly.
type ClickHandler = (option: string) => void;

export default function Options({ question, handleAnswerClick} : OptionsProps) {
  const optionsDiv = useRef<HTMLDivElement>(null);

  function circularTranslate(index: number, total: number) {
    let maxMargin = (optionsDiv.current?.clientHeight || 300) / 2;
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
        >
          {
            !question ?
            <ThreeDots 
              height="10vh"
              width="200" 
              radius="7"
              color="#ff9d1b" 
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            /> :
            (question.children.map(
              (option: Question, index: number) => (
                <motion.div
                  variants={optionVariants}
                  whileTap={{ scale: 0.97 }}
                  className={styles.option}
                  style={
                    {
                      marginTop: `${circularTranslate(index, question.children.length)}px`
                    }
                  }
                  onClick={_ => handleAnswerClick(option)}
                  key={option.tag.id}>
                  {option.tag.name}
                </motion.div>
              )
            ))
          }
        </motion.div>
  )
}