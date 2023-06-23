from sqlalchemy.orm import Session

from .models import models, schemas

def get_all_restaurants(db: Session):
    return db.query(models.Restaurant).all()

def get_restaurant(db: Session, restaurant_id: int):
    return db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()

def get_restaurant_by_name(db: Session, restaurant_name: str):
    return db.query(models.Restaurant).filter(models.Restaurant.restaurant_name == restaurant_name).first()

def create_restaurant(db: Session, restaurant: schemas.Restaurant):
    db_rest = models.Restaurant(**restaurant.dict())
    db.add(db_rest)
    db.commit()
    db.refresh(db_rest)
    return db_rest

def create_menu_item(db: Session, item: schemas.MenuItem):
    db_item = models.MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def create_item_tag(db: Session, item_tag: schemas.ItemTag):
    db_item_tag = models.ItemTag(**item_tag.dict())
    db.add(db_item_tag)
    db.commit()
    db.refresh(db_item_tag)
    return db_item_tag

def create_tag(db: Session, tag: schemas.Tag):
    db_tag = models.Tag(**tag.dict())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def get_all_tags(db: Session):
  return db.query(models.Tag).all()