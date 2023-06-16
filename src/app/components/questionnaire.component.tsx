'use client';

import Image from 'next/image';
import meenew from '@/assets/character/meenew.png';
import styles from '@/app/components/menu.module.css';
import ProgressBar from '@/app/components/progress_bar.component';
import { AnimatePresence, motion, stagger, animate } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';


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

export default function Questionnaire({ restaurant_data }: any) {
  const { restaurant_name, questions } = restaurant_data;
  const [questionNumber, setQuestionNumber] = useState(0);
  const [complete, setComplete] = useState(false);
  const recordedAnswers = useRef<(string | null)[]>([]);
  const optionsDiv = useRef<HTMLDivElement>(null);
  const currentOption = useRef<HTMLDivElement>(null);

  function handleAnswerClick(option: string) {
    recordedAnswers.current.push(option);

    if (questionNumber + 1 == questions.length) {
      setComplete(true);
      setQuestionNumber(questionNumber + 1);
      return;
    }

    setQuestionNumber((questionNumber + 1) % questions.length);
  }

  function handleBack() {
    recordedAnswers.current.pop();
    let nextIndex = (questionNumber - 1) % questions.length;
    if (nextIndex < 0) nextIndex = questions.length + nextIndex;
    setComplete(nextIndex == questions.length);
    setQuestionNumber(nextIndex);
  }

  function handleSkip() {
    recordedAnswers.current.push()
    setComplete(questionNumber + 1 == questions.length);
    setQuestionNumber((questionNumber + 1) % questions.length);
  }

  function circularTranslate(index: number, total: number) {
    // Calculate 1 rem unit.
    let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    let maxMargin = (optionsDiv.current?.clientHeight ?? 10 * rem) - 3 * rem;
    let mid_index = (total - 1) / 2;
    let k = maxMargin / Math.pow(mid_index, 2);
    let offset = k * Math.pow(index - mid_index, 2)

    return offset;
  }

  return (
    <div className={`${styles.vflex} ${styles.container}`}>
      <div className={styles.header}><b>Welcome to {restaurant_name}!</b></div>
      <div className={styles.control}>
        <div className={styles.vflex}>
          {questionNumber != 0 && <button
            className={`${styles.cbtn} ${styles.left}`}
            onClick={handleBack}
          >
          </button>}
        </div>
        <div className={styles.prompt}>
          {!complete && questions[questionNumber].question_text}
        </div>
        <div className={styles.vflex}>
          <button
            className={`${styles.cbtn} ${styles.right}`}
            onClick={handleSkip}
          >
          </button>
        </div>
      </div>
      <ProgressBar progressPercent={questionNumber / questions.length * 100} />
      {
        complete ? 
        (<div>Done!</div>) : 
        <motion.div 
          className={styles.hflex} 
          ref={optionsDiv}
          initial="hidden"
          animate="show"
          variants={containerVariants}
          key={questions[questionNumber].id}
        >
          {
            questions[questionNumber].answer_options.map(
              (option: any, index: number) => (
                <motion.div
                  variants={optionVariants}
                  whileTap={{ scale: 0.97 }}
                  className={styles.option}
                  ref={currentOption}
                  style={
                    {
                      marginTop: `${circularTranslate(index, questions[questionNumber].answer_options.length)}px`
                    }
                  }
                  onClick={e => handleAnswerClick(option)}
                  key={option.id}>
                  {option.text}
                  <div className='tail'></div>
                </motion.div>
              )
            )
          }
        </motion.div>
      }
      <Image src={meenew} alt='meenew' className={styles.mascot}></Image>
    </div>
  )
}