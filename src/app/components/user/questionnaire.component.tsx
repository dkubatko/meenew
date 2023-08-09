'use client';

import Image from 'next/image';
import meenew from '@/assets/character/meenew.png';
import styles from '@/app/components/user/questionnaire.module.css';
import ProgressBar from '@/app/components/progressBar.component';
import Results from '@/app/components/results.component';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Options from './options.component';
import useFetchRestaurant from '@/app/hooks/useFetchRestaurant';
import { Question } from '@/app/types/questionnaire';
import useFetchQuestionnaire from '@/app/hooks/useFetchQuestionnaire';
import { Tag } from '@/app/types/tag';

export default function Questionnaire() {
  const searchParams = useSearchParams();
  const { restaurantData } = useFetchRestaurant(searchParams.get('id') ?? '0');
  const { questionnaire, isLoading } = useFetchQuestionnaire(searchParams.get('id') ?? '0');
  const [ questionStack, setQuestionStack ] = useState<Question[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update question stack upon initalization of the questionnaire.
  useEffect(() => {
    if (questionnaire) {
      setQuestionStack([questionnaire]);
      setIsInitialized(true);
    }
  }, [questionnaire]);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  // Sets the current question to the top-most element of the question stack upon
  // questionStack update.
  const getNextQuestion = useCallback(() => {
    if (questionStack.length > 0) {
      const nextQuestion = questionStack[0];
      setCurrentQuestion(nextQuestion);
    } else if (isInitialized && questionStack.length == 0) {
      // If no questions are left in the question stack after initialization, 
      // the questionnaire is complete.
      setComplete(true);
    }
  }, [questionStack, isInitialized]);

  useEffect(() => {
    getNextQuestion();
  }, [questionStack, getNextQuestion]);

  // TODO: Handle option click pops current question and updates the stack.

  const [questionNumber, setQuestionNumber] = useState(0);
  const [complete, setComplete] = useState(false);

  const recordedAnswers = useRef<(string | null)[]>([]);

  const { restaurant_name = "" } = restaurantData || {};

  const handleAnswerClick = (selectedOption: Question) => {
    // Remove the current question from the stack.
    const updatedStack = [...questionStack].slice(1);
  
    // Check if the option selected is associated with a leaf tag.
    if (selectedOption.tag && selectedOption.tag.is_leaf) {
      // If it is, add the tag to the selected tags.
      setSelectedTags(prevTags => [...prevTags, selectedOption.tag]);
    } else if (!selectedOption.tag.is_leaf) {
      // If it isn't, push the selected question to the stack.
      updatedStack.unshift(selectedOption);
    }
  
    // Update the question stack
    setQuestionStack(updatedStack);
  }
  

  function handleBack() {
    alert("To be implemented.");
  }

  function handleSkip() {
    alert("To be implemented.");
  }

  return (
    <div className={`${styles.vflex} ${styles.container}`}>
      <div className={styles.header}><b>{restaurant_name ? `Welcome to ${restaurant_name}!` : "Loading..."}</b></div>
      { (currentQuestion && !complete) && (<div className={styles.control}>
        <div className={styles.vflex}>
          {questionNumber != 0 && <button
            className={`${styles.cbtn} ${styles.left}`}
            onClick={handleBack}
          >
          </button>}
        </div>
        <div className={styles.prompt}>
          {!complete && currentQuestion.question_text}
        </div>
        <div className={styles.vflex}>
          <button
            className={`${styles.cbtn} ${styles.right}`}
            onClick={handleSkip}
          >
          </button>
        </div>
      </div>) }
      { (currentQuestion && !complete) && <ProgressBar progressPercent={questionNumber / questionStack.length * 100} /> }
      {
        complete ? 
        <Results /> :
        (currentQuestion && <Options question={currentQuestion} handleAnswerClick={handleAnswerClick}></Options>)
      }
      <div className={styles.bottom}>
        <Image src={meenew} alt='meenew' className={styles.mascot}></Image>
      </div>
    </div>
  )
}