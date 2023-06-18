'use client';

import Image from 'next/image';
import meenew from '@/assets/character/meenew.png';
import styles from '@/app/components/menu.module.css';
import ProgressBar from '@/app/components/progress_bar.component';
import { AnimatePresence, motion, stagger, animate } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Options from './options.component';
import { ThreeDots } from 'react-loader-spinner';

const fakeData = {
  restaurant_name: 'Test',
  questions: [
    {
      id: 0,
      question_text: 'Test question',
      answer_options: [
        { id: 1, text: 'test'}
      ]
    }
  ]
}

export default function Questionnaire() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);

  const [questionNumber, setQuestionNumber] = useState(0);
  const [complete, setComplete] = useState(false);

  const recordedAnswers = useRef<(string | null)[]>([]);

  const { restaurant_name, questions } = restaurantData ?? fakeData;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/${searchParams.get('id') ?? 'Test'}/stub`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurantData(data);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      })
    }, []);

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
        (loading ? <ThreeDots 
          height="10vh"
          width="200" 
          radius="7"
          color="#ff9d1b" 
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
           /> : 
        <Options question={questions[questionNumber]} handleAnswerClick={handleAnswerClick}></Options>
        )
      }
      <div className={styles.bottom}>
        <Image src={meenew} alt='meenew' className={styles.mascot}></Image>
      </div>
    </div>
  )
}