from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .MenuItem import MenuItem, MenuItemRead

class RestaurantBase(SQLModel):
    restaurant_name: str = Field(unique=True, index=True)

class Restaurant(RestaurantBase, table = True):
    __tablename__: str = "restaurants"

    id: Optional[int] = Field(default=None, primary_key=True)

    menu_items: List['MenuItem'] = Relationship(back_populates="restaurant")

class RestaurantRead(RestaurantBase):
    id: int
    menu_items: List['MenuItemRead'] = []

class RestaurantCreate(RestaurantBase):
    pass