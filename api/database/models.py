from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class ItemTagLink(SQLModel, table = True):
    __tablename__: str = "itemtags"

    tag_id: Optional[int] = Field(default=None, foreign_key="tags.id", primary_key=True)
    menu_item_id: Optional[int] = Field(default=None, foreign_key="menuitems.id", primary_key=True)

class RestaurantBase(SQLModel):
    restaurant_name: str = Field(unique=True, index=True)

class Restaurant(RestaurantBase, table = True):
    __tablename__: str = "restaurants"

    id: Optional[int] = Field(default=None, primary_key=True)

    menu_items: List["MenuItem"] = Relationship(back_populates="restaurant")

class MenuItemBase(SQLModel):
    item_name: str = Field(unique=True, index=True)

class MenuItem(MenuItemBase, table = True):
    __tablename__: str = "menuitems"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    restaurant_id: Optional[int] = Field(default = None, foreign_key="restaurants.id")
    image_path: Optional[str] = Field(default = None)

    restaurant: Optional[Restaurant] = Relationship(back_populates="menu_items")
    tags: List["Tag"] = Relationship(back_populates="menu_items", link_model=ItemTagLink)

class TagBase(SQLModel):
    name: str = Field(unique=True, index=True)

class Tag(TagBase, table = True):
    __tablename__: str = "tags"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)

    menu_items: List["MenuItem"] = Relationship(back_populates="tags", link_model=ItemTagLink)

class TagRead(TagBase):
    id: int

class MenuItemRead(MenuItemBase):
    id: int
    image_path: Optional[str]
    tags: List["TagRead"] = []

class RestaurantRead(RestaurantBase):
    id: int
    menu_items: List["MenuItemRead"] = []

class RestaurantCreate(RestaurantBase):
    pass

class TagCreate(TagBase):
    pass

class MenuItemCreate(MenuItemBase):
    restaurant_id: int
    tags: List["TagRead"]









