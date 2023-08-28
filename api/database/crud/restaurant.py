from sqlmodel import Session, select
from fastapi import HTTPException
from .base import CRUDBase
from ..models import Restaurant, RestaurantCreate

class RestaurantCRUD(CRUDBase):
    def get_all(self):
        return self.db.exec(select(Restaurant)).all()

    def get(self, restaurant_id: int):
        restaurant = self.db.get(Restaurant, restaurant_id)
        if not restaurant:
            raise HTTPException(status_code=404, detail=f"Restaurant w/ id = {restaurant_id} not found.")
        return restaurant

    def create(self, restaurant: RestaurantCreate):
        db_restaurant = Restaurant.from_orm(restaurant)
        self.db.add(db_restaurant)
        self.db.commit()
        self.db.refresh(db_restaurant)
        return db_restaurant

    def delete(self, restaurant_id: int):
        db_restaurant = self.get(restaurant_id)
        self.db.delete(db_restaurant)
        self.db.commit()
        return {"ok": True}
