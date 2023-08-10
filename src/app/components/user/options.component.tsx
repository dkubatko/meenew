import { motion } from "framer-motion";
import styles from '@/app/components/user/options.module.css';
import { ThreeDots } from "react-loader-spinner";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Question } from "@/app/types/questionnaire";

const optionVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  entrance: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: index * 0.2,
      ease: "easeInOut",
      duration: 0.5
    }
  }),
  static: { scale: 1, opacity: 1 },
  hover: { scale: 1.1 }
};

interface OptionsProps {
  question: Question;
  handleOptionClick: (question: Question) => void;
  selectedOptions: Question[];
}

export default function Options({ question, handleOptionClick, selectedOptions }: OptionsProps) {
  const optionsDiv = useRef<HTMLDivElement>(null);
  const [maxMargin, setMaxMargin] = useState<number>(0);
  const [initialRender, setInitialRender] = useState(true);

  useLayoutEffect(() => {
    if (optionsDiv.current) {
      setMaxMargin(optionsDiv.current.clientHeight / 2);
    }
  }, [optionsDiv]);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  function circularOffset(index: number, total: number) {
    let mid_index = (total - 1) / 2;
    let k = maxMargin / Math.pow(mid_index, 2);

    // Check if index is one of the middle elements
    if (index === Math.floor(mid_index) || (total % 2 === 0 && index === Math.ceil(mid_index))) {
      return 0; // Center elements get 0 offset
    }


    let offset = k * Math.pow(index - mid_index, 2);
    return offset;
  }

  return (
    <div
      className={styles.hflex}
      ref={optionsDiv}
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
                initial="hidden"
                animate={initialRender ? "entrance" : "static"}
                exit="hidden"
                custom={index}
                whileHover="hover"
                className={selectedOptions.includes(option) ? styles.selectedOption : styles.unselectedOption}
                style={
                  {
                    marginTop: `${circularOffset(index, question.children.length)}px`
                  }
                }
                onClick={_ => handleOptionClick(option)}
                key={option.tag.id}>
                {option.tag.name}
              </motion.div>
            )
          ))
      }
    </div>
  )
}