from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
  from .Category import Category
  from .Tag import Tag

class TagLabelBase(SQLModel):
    name: str = Field(unique=True, index=True)

class TagLabel(TagLabelBase, table=True):
    __tablename__: str = "taglabels"
    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id", nullable=True)

    category: Optional['Category'] = Relationship(back_populates="tag_labels")
    tags: List['Tag'] = Relationship(back_populates="label")

class TagLabelRead(TagLabelBase):
   id: Optional[int] = None
   category_id: Optional[int] = None
   tags: List['Tag'] = []

class TagLabelCreate(TagLabelBase):
   category_id: int