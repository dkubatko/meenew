from . import models
from sqlmodel import Session, select

def get_all_restaurants(db: Session):
    return db.exec(select(models.Restaurant)).all()

def get_restaurant(db: Session, restaurant_id: int):
    return db.get(models.Restaurant, restaurant_id)

def create_restaurant(db: Session, restaurant: models.RestaurantCreate):
    db_restaurant = models.Restaurant.from_orm(restaurant)
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

def create_menu_item(db: Session, menu_item: models.MenuItemCreate):
    db_menu_item = models.MenuItem.from_orm(menu_item)
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item

def create_tag(db: Session, tag: models.TagCreate):
    db_tag = models.Tag.from_orm(tag)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_all_tags(db: Session):
  return db.exec(select(models.Tag)).all()