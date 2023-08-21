from sqlmodel import Session, select
from fastapi import HTTPException
from .base import CRUDBase
from ..models import Category, CategoryTreeRead, CategoryLite, CategoryRead

class CategoryCRUD(CRUDBase):
      def get(self, restaurant_id: int, category_id: int):
        category = self.db.query(Category).filter(
            Category.id == category_id,
            Category.restaurant_id == restaurant_id
        ).first()

        if not category:
            raise HTTPException(status_code=404, detail=f"Category w/ id = {category_id} and restaurant_id = {restaurant_id} not found.")

        # Function to recursively get all menu items for a category
        def get_all_menu_items(cat):
            menu_items = [item for item in cat.menu_items]
            for child in cat.children:
                menu_items.extend(get_all_menu_items(child))
            return menu_items

        # Function to get all tag labels up the tree
        def get_all_tag_labels(cat):
            tag_labels = [tag_label for tag_label in cat.tag_labels]
            parent = cat.parent
            while parent:
                tag_labels.extend(parent.tag_labels)
                parent = parent.parent
            return tag_labels

        # Create CategoryRead for children
        children = []
        for child in category.children:
            children.append(
                CategoryRead(
                    name=child.name,
                    restaurant_id=restaurant_id,
                    id=child.id,
                    menu_items=get_all_menu_items(child),
                    tag_labels=child.tag_labels,
                    parent=CategoryLite(id=child.parent_id,
                                        restaurant_id=restaurant_id,
                                        name=child.parent.name if child.parent else None)
                )
            )

        # Create the CategoryTreeRead for the requested category
        return CategoryTreeRead(
            name=category.name,
            restaurant_id=restaurant_id,
            id=category.id,
            parent=category.parent,
            menu_items=category.menu_items,
            children=children,
            tag_labels=get_all_tag_labels(category)
        )
      
      def update(self, category: CategoryLite):
          db_category = self.db.query(Category).filter(
            Category.id == category.id,
              Category.restaurant_id == category.restaurant_id
          ).first()

          if not db_category:
              raise HTTPException(status_code=404, detail=f"Category w/ id = {category.id} and restaurant_id = {category.restaurant_id} not found.")
          
          db_category.name = category.name

          self.db.commit()
          self.db.refresh(db_category)

          return db_category