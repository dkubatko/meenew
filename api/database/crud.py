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

    # If the tag is not a leaf, delete all its children
    if not tag.is_leaf:
        children_tags = db.query(models.Tag).filter(models.Tag.parent_id == tag_id).all()
        for child_tag in children_tags:
            delete_tag(db, child_tag.id)

    # Delete the tag itself
    db.delete(tag)
    db.commit()

    return {"ok": True}

def get_menu_item(db: Session, menu_item_id: int):
  menu_item = db.get(models.MenuItem, menu_item_id)

  if not menu_item:
    raise HTTPException(status_code=404, detail=f"Menu item w/ id = {menu_item_id} not found.")
  
  return menu_item

def update_menu_item(db: Session, menu_item: models.MenuItemRead):
   db_menu_item = get_menu_item(db, menu_item.id)
   
   db_menu_item.item_name = menu_item.item_name
   db_menu_item.image_path = menu_item.image_path

   db_menu_item.tags.clear()  # Clear current tags - appropriate if replacing entirely

   for tag in menu_item.tags:
       # Retrieve the tag instance from the db
       db_tag = get_tag(db, tag.id)  # I'm assuming get_tag is a function you've defined to get a tag by id
       if db_tag is not None:  # Only add if tag exists in db
           db_menu_item.tags.append(db_tag)

   db.commit()
   db.refresh(db_menu_item)
   return db_menu_item

def delete_menu_item(db: Session, menu_item_id: int):
    menu_item = db.get(models.MenuItem, menu_item_id)

    if not menu_item:
      raise HTTPException(status_code=404, detail=f"Menu item w/ id = {menu_item_id} not found.")
    
    db.delete(menu_item)
    db.commit()
    
    return { "ok": True }

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

def update_tag(db: Session, tag: models.TagRead):
   db_tag = get_tag(db, tag.id)
   
   db_tag.name = tag.name
   db_tag.is_leaf = tag.is_leaf

   db.commit()
   db.refresh(db_tag)
   return db_tag

def get_all_tags(db: Session):
  return db.exec(select(models.Tag)).all()

def get_root_tag(db: Session):
   return get_tag(db, 0)

def get_category(db: Session, restaurant_id: int, category_id: int):
    category = db.query(models.Category).filter(
        models.Category.id == category_id,
        models.Category.restaurant_id == restaurant_id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail=f"Category w/ id = {category_id} and restaurant_id = {restaurant_id} not found.")

    return category