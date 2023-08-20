from sqlmodel import Session, select
from fastapi import HTTPException
from .base import CRUDBase
from ..models import Category

class CategoryCRUD(CRUDBase):
    def get(self, restaurant_id: int, category_id: int):
        category = self.db.query(Category).filter(
            Category.id == category_id,
            Category.restaurant_id == restaurant_id
        ).first()

        if not category:
            raise HTTPException(status_code=404, detail=f"Category w/ id = {category_id} and restaurant_id = {restaurant_id} not found.")

        return category