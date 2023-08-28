from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .MenuItem import MenuItem, MenuItemRead
    from .Category import Category, CategoryLite

class RestaurantBase(SQLModel):
    restaurant_name: str = Field(unique=True, index=True)
    root_category_id: int = Field(foreign_key="categories.id", index=True) # Link to the root category

class Restaurant(RestaurantBase, table=True):
    __tablename__: str = "restaurants"

    id: Optional[int] = Field(default=None, primary_key=True)

    # Removed the direct relationship to the root category
    menu_items: List['MenuItem'] = Relationship(back_populates="restaurant")

class RestaurantRead(RestaurantBase):
    id: int
    menu_items: List['MenuItemRead'] = []

class RestaurantCreate(RestaurantBase):
    pass