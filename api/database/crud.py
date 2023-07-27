from . import models
from sqlmodel import Session, select
from fastapi import HTTPException

def get_all_restaurants(db: Session):
    return db.exec(select(models.Restaurant)).all()

def get_restaurant(db: Session, restaurant_id: int):
    restaurant = db.get(models.Restaurant, restaurant_id)

    if not restaurant:
      raise HTTPException(status_code=404, detail=f"Restaurant w/ id = {restaurant_id} not found.")
    
    return restaurant

def create_restaurant(db: Session, restaurant: models.RestaurantCreate):
    db_restaurant = models.Restaurant.from_orm(restaurant)
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

def get_tag(db: Session, tag_id: int):
    tag = db.get(models.Tag, tag_id)

    if not tag:
      raise HTTPException(status_code=404, detail=f"Tag w/ id = {tag_id} not found.")
    
    return tag

def delete_tag(db: Session, tag_id: int):
    tag = db.get(models.Tag, tag_id)

    if not tag:
      raise HTTPException(status_code=404, detail=f"Tag w/ id = {tag_id} not found.")
    
    db.delete(tag)
    db.commit()
    
    return { "ok": True }

def get_menu_item(db: Session, menu_item_id: int):
  menu_item = db.get(models.MenuItem, menu_item_id)

  if not menu_item:
    raise HTTPException(status_code=404, detail=f"Menu item w/ id = {menu_item_id} not found.")
  
  return menu_item

def create_menu_item(db: Session, menu_item: models.MenuItemCreate):
    db_menu_item = models.MenuItem.from_orm(menu_item)
    db_menu_item.tags = [get_tag(db, tag.id) for tag in menu_item.tags]
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item

def add_tag_for_menu_item(db: Session, menu_item_id: int, tag_id: int):
   db_menu_item = get_menu_item(db, menu_item_id)
   db_tag = get_tag(db, tag_id)

   db_menu_item.tags.append(db_tag)

   db.commit()
   db.refresh(db_menu_item)
   return db_menu_item

def add_image_url_to_menu_item(db: Session, menu_item_id: int, image_url: str):
  db_menu_item = get_menu_item(db, menu_item_id)

  db_menu_item.image_path = image_url

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