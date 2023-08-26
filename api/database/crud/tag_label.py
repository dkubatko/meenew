from typing import List
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from fastapi import HTTPException
from .base import CRUDBase
from ..models import TagLabel, TagLabelCreate
from .category import CategoryCRUD

class TagLabelCRUD(CRUDBase):
    def __init__(self, db: Session):
        super().__init__(db)
        self.Category = CategoryCRUD(db)

    def create(self, tagLabel: TagLabelCreate):
        db_tag_label = TagLabel.from_orm(tagLabel)
        
        self.db.add(db_tag_label)
        self.db.commit()
        self.db.refresh(db_tag_label)

        return db_tag_label
    
    def get(self, tag_label_id: int):
        db_tag_label = self.db.get(TagLabel, tag_label_id)

        if not db_tag_label:
          raise HTTPException(status_code=404, detail=f"Tag label w/ id = {tag_label_id} not found.")
        
        return db_tag_label
    
    def get_by_categories(self, category_ids: List[int], include_parents: bool = False):
        if include_parents:
            all_ids = set(category_ids)
            for category_id in category_ids:
                all_ids.update(self.Category.get_parent_category_ids(category_id))
        else:
            all_ids = category_ids

        db_tag_labels = self.db.exec(
            select(TagLabel)
            .where(TagLabel.category_id.in_(all_ids))
        ).all()

        return db_tag_labels
    
    def update(self, tagLabel: TagLabelCreate):
        db_tag_label = self.get(tagLabel.id)
   
        db_tag_label.name = tagLabel.name

        self.db.commit()
        self.db.refresh(db_tag_label)

        return db_tag_label

    def delete(self, tag_label_id: int):
        db_tag_label = self.db.get(TagLabel, tag_label_id)

        if not db_tag_label:
            raise HTTPException(status_code=404, detail=f"Tag label w/ id = {tag_label_id} not found.")

        # Delete the tag label itself
        self.db.delete(db_tag_label)
        self.db.commit()

        return {"ok": True}