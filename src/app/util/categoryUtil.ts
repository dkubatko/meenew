import { Category, CategoryTree } from "@/app/types/category";

export const getPathToRoot = (category: Category): number[] => {
  const path: number[] = [];
  let cur: Category | null = category;

  while (cur && cur.parent) { // Continue as long as there's a parent
    path.unshift(cur.id); // Add the current category's ID
    cur = cur.parent; // Move up to the parent
  }

  return path;
};

export const getCategoryTreeByPath = (rootCategory: CategoryTree, path: number[]): CategoryTree | null => {
  let currentCategoryTree: CategoryTree | null = rootCategory;

  for (const id of path) {
    if (!currentCategoryTree) return null;
    currentCategoryTree = currentCategoryTree.children?.find(child => child.id === id) || null;
  }

  return currentCategoryTree;
};
