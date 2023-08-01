import { useState, useCallback, useEffect } from 'react';
import { TagTree as TagTreeType } from '@/app/types/tag';
import { ServerAPIClient } from '@/app/api/APIClient';

const useFetchTagTree = () => {
  const [rootTag, setRootTag] = useState<TagTreeType | null>(null);

  const fetchTagTree = useCallback(async () => {
    const tagTree = await ServerAPIClient.Tag.getTree();
    setRootTag(tagTree);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTagTree();
  }, [fetchTagTree]);

  return { rootTag, fetchTagTree };
};

export default useFetchTagTree;