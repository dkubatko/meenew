from copy import deepcopy
from ..database.models import RestaurantRead, TagRead, MenuItemRead, CategoryTreeRead
from ..database.dtos import Question
from typing import List, Optional

class Compute:
    def __init__(self, restaurant: RestaurantRead, categoryTree: CategoryTreeRead):
        self.restaurant = restaurant
        self.categoryTree = categoryTree
        self.coveredTags = [
            tag.id for menu_item in self.restaurant.menu_items for tag in menu_item.tags]

        # Begin with a deep copy of tagTree and modify that for the filtered version
        self.filteredTagTree = self.filter_tag_tree(self.tagTree)

    def filter_category_tree(self, categoryRoot: CategoryTreeRead) -> Optional[CategoryTreeRead]:
        '''Returns a new tree derived from tagRoot, containing only the nodes covered by menu items.'''

        # Base case: if the tagRoot is a leaf node
        if len(categoryRoot.children) == 0:
            # FIX
            if categoryRoot.id in self.coveredTags:
                # return a shallow copy of the leaf node
                return CategoryTreeRead(**categoryRoot.dict())
            else:
                return None  # Leaf node not associated with any menu item

        # If not a leaf, recursively filter children
        filtered_children = []
        for child in categoryRoot.children:
            filtered_child = self.filter_category_tree(child)
            if filtered_child:  # if not None
                filtered_children.append(filtered_child)

        # If we've filtered out all children, return None
        if not filtered_children:
            return None

        # Return a new node with the filtered children
        return CategoryTreeRead(
            id=categoryRoot.id,
            name=categoryRoot.name,
            is_leaf=categoryRoot.is_leaf,
            parent_id=categoryRoot.parent_id,
            children=filtered_children)
    
    def questionnaire(self) -> Question:
        if not self.filteredTagTree:
            raise ValueError("Filtered Tag Tree is not constructed.")
        
        return self.construct_question_tree(self.filteredTagTree)

    def construct_question_tree(self, tagRoot: CategoryTreeRead) -> Question:
        # Base case for leaf nodes
        if tagRoot.is_leaf:
            return Question(
                tag=tagRoot.toTagRead(),
                question_text=None,
                children=[]
            )

        # For non-leaf nodes, recurse on children
        child_questions = [self.construct_question_tree(child) for child in tagRoot.children]

        question_text = f"What {tagRoot.name} would you prefer?" if not tagRoot.required else None

        return Question(
            tag=tagRoot.toTagRead(),
            question_text=question_text,
            children=child_questions
        )
    
    def get_best_match(self, tags: List[TagRead]) -> MenuItemRead:
        # Fetch all menu items of the restaurant
        menu_items = self.restaurant.menu_items

        max_overlap = 0
        best_match = None

        for item in menu_items:
            overlap_count = len(set([tag.id for tag in item.tags]).intersection([tag.id for tag in tags]))
            if overlap_count > max_overlap:
                max_overlap = overlap_count
                best_match = item

        return MenuItemRead.from_orm(best_match) if best_match else best_match