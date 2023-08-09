import { Question } from '@/app/types/questionnaire';
import { useCallback, useEffect, useState } from 'react';
import { ServerAPIClient } from '../api/APIClient';


const useFetchQuestionnaire = (restaurantId: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questionnaire, setQuestionnaire] = useState<Question | null>(null);

  const fetchQuestionnaire = useCallback(async () => {
    setIsLoading(true);
    const questionnaireData = await ServerAPIClient.Restaurant.getQuestionnaire(restaurantId);
    setQuestionnaire(questionnaireData);
    setIsLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchQuestionnaire();
  }, [fetchQuestionnaire]);

  return { questionnaire, isLoading, fetchQuestionnaire };
}

export default useFetchQuestionnaire;