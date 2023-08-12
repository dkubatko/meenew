from typing import Optional
from sqlmodel import SQLModel, Field

class ItemTagLink(SQLModel, table = True):
    __tablename__: str = "itemtags"

    tag_id: Optional[int] = Field(default=None, foreign_key="tags.id", primary_key=True)
    menu_item_id: Optional[int] = Field(default=None, foreign_key="menuitems.id", primary_key=True)