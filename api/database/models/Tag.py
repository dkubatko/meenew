from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from .ItemTagLink import ItemTagLink
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .TagLabel import TagLabel
    from .MenuItem import MenuItem

class TagBase(SQLModel):
    name: str = Field(index=True)
    label_id: Optional[int] = Field(default=None, foreign_key="taglabels.id", nullable=True)

class Tag(TagBase, table=True):
    __tablename__: str = "tags"
    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)

    label: Optional['TagLabel'] = Relationship(back_populates="tags")
    menu_items: List['MenuItem'] = Relationship(back_populates="tags", link_model=ItemTagLink)

class TagRead(TagBase):
    id: int

class TagCreate(TagBase):
    pass