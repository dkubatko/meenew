from sqlmodel import Session, select
from fastapi import HTTPException
from .base import CRUDBase
from ..models import TagLabel, TagLabelCreate

class TagLabelCRUD(CRUDBase):
    def create(self, tagLabel: TagLabelCreate):
        db_tag_label = TagLabel.from_orm(tagLabel)
        
        self.db.add(db_tag_label)
        self.db.commit()
        self.db.refresh(db_tag_label)

        return db_tag_label