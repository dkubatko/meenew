'use client';

import Image from 'next/image';
import meenew from '@/assets/character/meenew.png';
import styles from '@/app/components/user/questionnaire.module.css';
import ProgressBar from '@/app/components/progress_bar.component';
import Results from '@/app/components/results.component';
import { AnimatePresence, motion, stagger, animate } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Options from './options.component';
import { ThreeDots } from 'react-loader-spinner';

type RestaurantData = {
  restaurant_name: string,
  questions: any[],
}

export default function Questionnaire() {
  const searchParams = useSearchParams();
  const [restaurantData, setRestaurantData] = useState<RestaurantData>();

  const [questionNumber, setQuestionNumber] = useState(0);
  const [complete, setComplete] = useState(false);

  const recordedAnswers = useRef<(string | null)[]>([]);

  const { restaurant_name = "", questions = [] } = restaurantData || {};

  useEffect(() => {
    fetch(`/api/${searchParams.get('id') ?? 'Test'}/stub`)
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setRestaurantData(data);
        }, 2000);
      })
    }, [searchParams]);

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

  return (
    <div className={`${styles.vflex} ${styles.container}`}>
      <div className={styles.header}><b>{restaurant_name ? `Welcome to ${restaurant_name}!` : "Loading..."}</b></div>
      { (questions.length > 0 && !complete) && (<div className={styles.control}>
        <div className={styles.vflex}>
          {questionNumber != 0 && <button
            className={`${styles.cbtn} ${styles.left}`}
            onClick={handleBack}
          >
          </button>}
        </div>
        <div className={styles.prompt}>
          {!complete && questions[questionNumber]?.question_text}
        </div>
        <div className={styles.vflex}>
          <button
            className={`${styles.cbtn} ${styles.right}`}
            onClick={handleSkip}
          >
          </button>
        </div>
      </div>) }
      { (questions.length > 0 && !complete) && <ProgressBar progressPercent={questionNumber / questions.length * 100} /> }
      {
        complete ? 
        <Results /> :
        <Options question={questions[questionNumber] ?? null} handleAnswerClick={handleAnswerClick}></Options>
      }
      <div className={styles.bottom}>
        <Image src={meenew} alt='meenew' className={styles.mascot}></Image>
      </div>
    </div>
  )
}