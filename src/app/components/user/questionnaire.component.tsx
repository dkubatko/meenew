'use client';

import Image from 'next/image';
import meenew from '@/assets/character/meenew.png';
import styles from '@/app/components/user/questionnaire.module.css';
import ProgressBar from '@/app/components/user/progressBar.component';
import Results from '@/app/components/user/results.component';
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
    children: [],
    tag: tag,
  }
}

function tagLabelToQuestion(tagLabel: TagLabel, category: CategoryTreeLite): Question {
  return {
    id: tagLabel.id!,
    name: tagLabel.name,
    children: tagLabel.tags.map(tagToQuestion),
    tag_label: tagLabel,
    category: category,
  }
}

function categoryToQuestion(category: CategoryTreeLite): Question {
  return {
    id: category.id!,
    name: category.name,
    // Add questions related to the tag labels and subcategories as children of this question.
    children: category.children.map(categoryToQuestion),
    category: category,
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

  // Sets the current question to the top-most element of the question stack upon
  // questionStack update.
  const getNextQuestion = useCallback(async () => {
    if (questionStack.length > 0) {
      const nextQuestion = questionStack[0];
      setCurrentQuestion(nextQuestion);
    } else {
      // If no questions are left in the question stack and tags are selected,
      // then the questionnaire is complete.
      setComplete(true);
    }
  }, [questionStack]);

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

    selectedOptions.forEach(selectedOption => {
      if (selectedOption.tag) {
        // If an option is a tag, add it to selected tags.
        setSelectedTagsIds([...selectedTagIds, selectedOption.id]);
      } else if (selectedOption.tag_label) {
        // For tag label question, just add the question related.
        updatedStack.unshift(selectedOption);
      } else if (selectedOption.category) {
        // If an option is a category, add it to selected categories.
        setSelectedCategoriesIds([...selectedCategoriesIds, selectedOption.id]);
        // Add this option to the stack if it has more subcategories.
        if (selectedOption.category.children.length > 0) {
          updatedStack.unshift(selectedOption);
        }
        // Add questions related to all the tag labels for this category to the stack.
        selectedOption.category.tag_labels.forEach(tagLabel => {
          updatedStack.unshift(tagLabelToQuestion(tagLabel, selectedOption.category!));
        });
      };
    });

    // Update the question stack
    setQuestionStack(updatedStack);
    // Update the question number
    setQuestionNumber(questionNumber + 1);

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
          {!complete && currentQuestion.tag_label ?
          `What ${currentQuestion.tag_label.name.toLowerCase()} would you like for your ${currentQuestion.category!.name.toLowerCase()}?` :
          `Out of ${currentQuestion.category!.name.toLowerCase()}, what would you prefer?`}
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
            selectedCategoryIds={selectedCategoriesIds}
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