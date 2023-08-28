from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from .ItemTagLink import ItemTagLink
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .Restaurant import Restaurant
    from .Category import Category
    from .Tag import Tag, TagRead


class MenuItemBase(SQLModel):
    # TODO: Remove as it can be accessed from category
    restaurant_id: Optional[int] = Field(default = None, foreign_key="restaurants.id")
    item_name: str = Field(unique=True, index=True)

class MenuItem(MenuItemBase, table = True):
    __tablename__: str = "menuitems"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    image_path: Optional[str] = Field(default = None)
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    category: Optional['Category'] = Relationship(back_populates="menu_items")
    restaurant: Optional['Restaurant'] = Relationship(back_populates="menu_items")
    tags: List['Tag'] = Relationship(back_populates="menu_items", link_model=ItemTagLink)

class MenuItemCreate(MenuItemBase):
    category_id: int
    image_path: Optional[str]
    tags: List['TagRead']

class MenuItemRead(MenuItemBase):
    id: int
    image_path: Optional[str]
    category_id: int
    tags: List['TagRead'] = []