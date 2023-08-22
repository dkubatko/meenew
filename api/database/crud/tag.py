from sqlmodel import Session, select
from fastapi import HTTPException
from .base import CRUDBase
from ..models import TagCreate, Tag, TagRead

class TagCRUD(CRUDBase):
    def create(self, tag: TagCreate):
        db_tag = Tag.from_orm(tag)

        self.db.add(db_tag)
        self.db.commit()
        self.db.refresh(db_tag)

        return db_tag
    
    def get(self, tag_id: int):
        db_tag = self.db.get(Tag, tag_id)

        if not db_tag:
          raise HTTPException(status_code=404, detail=f"Tag w/ id = {tag_id} not found.")
        
        return db_tag
    
    def update(self, tag: TagRead):
        db_tag = self.get(tag.id)
   
        db_tag.name = tag.name

        self.db.commit()
        self.db.refresh(db_tag)

        return db_tag

    def delete(self, tag_id: int):
        db_tag = self.db.get(Tag, tag_id)

        if not db_tag:
            raise HTTPException(status_code=404, detail=f"Tag w/ id = {tag_id} not found.")

        # Delete the tag itself
        self.db.delete(db_tag)
        self.db.commit()

        return {"ok": True}
