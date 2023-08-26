'use client';

import Image from 'next/image';
import meenew from '@/assets/character/meenew.png';
import styles from '@/app/components/user/questionnaire.module.css';
import ProgressBar from '@/app/components/progressBar.component';
import Results from '@/app/components/results.component';
import { useState, useEffect, useRef, useCallback } from 'react';
import Options from './options.component';
import { Tag, TagLabel } from '@/app/types/tag';
import { CategoryTreeLite } from '@/app/types/category';
import { ServerAPIClient } from '@/app/api/APIClient';
import Restaurant from '@/app/types/restaurant';
import { Question } from '@/app/types/questionnaire';

function tagToQuestion(tag: Tag): Question {
  return {
    id: tag.id!,
    name: tag.name,
    children: []
  }
}

function tagLabelToQuestion(tagLabel: TagLabel): Question {
  return {
    id: tagLabel.id!,
    name: tagLabel.name,
    children: tagLabel.tags.map(tagToQuestion)
  }
}

function categoryToQuestion(category: CategoryTreeLite): Question {
  return {
    id: category.id!,
    name: category.name,
    children: category.children.map(categoryToQuestion)
  }
}

interface QuestionnaireProps {
  restaurantData: any;
  categoryTree: any;
}

export default function Questionnaire({ restaurantData, categoryTree }: QuestionnaireProps) {
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant>(Restaurant.fromObject(restaurantData));
  const [currentCategoryTree, setCurrentCategoryTree] = useState<CategoryTreeLite>(CategoryTreeLite.fromObject(categoryTree));
  
  // Initialize the question stack with the root category.
  const [questionStack, setQuestionStack] = useState<Question[]>([categoryToQuestion(currentCategoryTree)]);

  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([]);
  const [selectedTagIds, setSelectedTagsIds] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const [selectingTags, setSelectingTags] = useState(false);

  // Sets the current question to the top-most element of the question stack upon
  // questionStack update.
  const getNextQuestion = useCallback(async () => {
    if (questionStack.length > 0) {
      const nextQuestion = questionStack[0];
      setCurrentQuestion(nextQuestion);
    } else if (!selectingTags && questionStack.length == 0) {
      // If no questions are left in the question stack and no tags are selected,
      // then fetch the questions for the selected categories.
      const tagLabels = await ServerAPIClient.TagLabel.get_by_categories(selectedCategoriesIds);
      setQuestionStack(tagLabels.map(tagLabelToQuestion));

      setCurrentQuestion(questionStack[0]);

      setSelectingTags(true);
    } else {
      // If no questions are left in the question stack and tags are selected,
      // then the questionnaire is complete.
      setComplete(true);
    }
  }, [questionStack, selectedCategoriesIds, selectingTags]);

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
    // Ids to be added as final preferences.
    const selectedIds: number[] = [];

    selectedOptions.forEach(selectedOption => {
      if (selectedOption.children.length == 0) {
        // If an option is a leaf, add it to the final preferences.
        selectedIds.push(selectedOption.id);
      } else {
        // Otherwise, add the question related to this option
        // to the stack of questions.
        updatedStack.unshift(selectedOption);
      }
    });

    // Add new ids to the state
    if (selectedIds.length > 0) {
      selectingTags ? 
      setSelectedTagsIds(prevSelectedTagIds => [...prevSelectedTagIds, ...selectedIds]) : 
      setSelectedCategoriesIds(prevSelectedCategories => [...prevSelectedCategories, ...selectedIds]);
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
          {currentRestaurant?.restaurant_name ? `Welcome to ${currentRestaurant.restaurant_name}!` : "Loading..."}
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
          {!complete && (selectingTags ? "As for the preferences..." : "I would like...")}
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
            selectedTagIds={selectedTagIds}
          /> :
          (currentQuestion &&
            <Options
              // Assign key to cause a re-render of the Options component
              // triggering initial animation.
              key={currentQuestion.id}
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