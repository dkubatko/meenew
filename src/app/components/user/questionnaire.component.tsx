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
  const [questionStack, setQuestionStack] = useState<Question[]>([]);
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

  // Updates the current question whenever the questionStack is changed.
  useEffect(() => {
    getNextQuestion();
  }, [questionStack, getNextQuestion]);

  const [questionNumber, setQuestionNumber] = useState(0);
  const [complete, setComplete] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Question[]>([]);

  const handleOptionClick = useCallback((option: Question) => {
    setSelectedOptions(prevSelectedOptions => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter(opt => opt !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  }, []);

  function handleAnswerClick() {
    // Start by removing the current question from the stack.
    const updatedStack = [...questionStack].slice(1);
    // Tags to be added as final preferences.
    const newTags: Tag[] = [];

    selectedOptions.forEach(selectedOption => {
      if (selectedOption.tag && selectedOption.tag.is_leaf) {
        // If an option is a leaf, add it to the final preferences.
        newTags.push(selectedOption.tag);
      } else if (!selectedOption.tag.is_leaf) {
        // Otherwise, add the question related to this option
        // to the stack of questions.
        updatedStack.unshift(selectedOption);
      }
    });

    // Add new tags to the state
    if (newTags.length > 0) {
      setSelectedTags(prevTags => [...prevTags, ...newTags]);
    }

    // Update the question stack
    setQuestionStack(updatedStack);
    // Update the question number
    setQuestionNumber(questionNumber + 1);
    // You might also want to reset the selected options after handling them
    setSelectedOptions([]);
  }

  function handleBack() {
    alert("To be implemented.");
  }

  return (
    <div className={`${styles.vflex} ${styles.container}`}>
      <div className={styles.header}>
        <b>
          {restaurantData?.restaurant_name ? `Welcome to ${restaurantData.restaurant_name}!` : "Loading..."}
        </b>
      </div>
      {(currentQuestion && !complete) && (<div className={styles.control}>
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
          {selectedOptions.length > 0 && <button
            className={`${styles.cbtn} ${styles.right}`}
            onClick={handleAnswerClick}
          >
          </button>}
        </div>
      </div>)}
      {
        (currentQuestion && !complete) && 
        <ProgressBar progressPercent={questionNumber / (questionStack.length + questionNumber) * 100} />
      }
      {
        complete ?
          <Results
            restaurantId={restaurantData?.id.toString()!}
            selectedTags={selectedTags}
          /> :
          (currentQuestion &&
            <Options
              // Assign key to cause a re-render of the Options component
              // triggering initial animation.
              key={currentQuestion.tag.id}
              question={currentQuestion}
              handleOptionClick={handleOptionClick}
              selectedOptions={selectedOptions}
            />)
      }
      <div className={styles.bottom}>
        <Image src={meenew} alt='meenew' className={styles.mascot}></Image>
      </div>
    </div>
  )
}