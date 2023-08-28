from sqlmodel import select, Session
from fastapi import HTTPException
from .base import CRUDBase
from ..models import MenuItem, MenuItemCreate, MenuItemRead
from .tag import TagCRUD

class MenuItemCRUD(CRUDBase):
    def __init__(self, db: Session):
        super().__init__(db)
        self.Tag = TagCRUD(db)

    def create(self, menu_item: MenuItemCreate):
            db_menu_item = MenuItem.from_orm(menu_item)
            db_menu_item.tags = [self.Tag.get(tag.id) for tag in menu_item.tags]
            
            self.db.add(db_menu_item)
            self.db.commit()
            self.db.refresh(db_menu_item)
            
            return db_menu_item
    
    def update(self, menu_item: MenuItemRead):
        db_menu_item = self.get(menu_item.id)
   
        db_menu_item.item_name = menu_item.item_name
        db_menu_item.image_path = menu_item.image_path

        db_menu_item.tags.clear()  # Clear current tags - appropriate if replacing entirely

        for tag in menu_item.tags:
            # Retrieve the tag instance from the db
            db_tag = self.Tag.get(tag.id)
            if db_tag is not None:  # Only add if tag exists in db
                db_menu_item.tags.append(db_tag)

        self.db.commit()
        self.db.refresh(db_menu_item)

        return db_menu_item

    def get(self, menu_item_id: int):
        menu_item = self.db.get(MenuItem, menu_item_id)

        if not menu_item:
          raise HTTPException(status_code=404, detail=f"Menu item w/ id = {menu_item_id} not found.")
        
        return menu_item
    

    def delete(self, menu_item_id: int):
        menu_item = self.db.get(MenuItem, menu_item_id)

        if not menu_item:
          raise HTTPException(status_code=404, detail=f"Menu item w/ id = {menu_item_id} not found.")
        
        self.db.delete(menu_item)
        self.db.commit()
        
        return { "ok": True }
    
    def add_tag(self, menu_item_id: int, tag_id: int):
        db_menu_item = self.get(menu_item_id)
        db_tag = self.Tag.get(tag_id)

        db_menu_item.tags.append(db_tag)

        self.db.commit()
        self.db.refresh(db_menu_item)

        return db_menu_item
    
    def add_image_url(self, menu_item_id: int, image_url: str):
        db_menu_item = self.get(menu_item_id)

        db_menu_item.image_path = image_url

        self.db.commit()
        self.db.refresh(db_menu_item)
        return db_menu_item
