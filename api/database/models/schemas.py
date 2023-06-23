from pydantic import BaseModel

class RestaurantBase(BaseModel):
    restaurant_name: str

class MenuItemBase(BaseModel):
    item_name: str

class ItemTagBase(BaseModel):
    pass

class TagBase(BaseModel):
    name: str

class ItemTag(ItemTagBase):
    id: int
    tag_id: int
    menu_item_id: int

    class Config:
        orm_mode = True
    
class Tag(TagBase):
    id: int
    item_tags: list[ItemTag] = []

    class Config:
        orm_mode = True

class TagRead(TagBase):
    id: int

    class Config:
        orm_mode = True

class ItemTagRead(ItemTagBase):
    id: int
    tag: TagRead

    class Config:
        orm_mode = True

class MenuItem(MenuItemBase):
    id: int
    restaurant_id: int
    item_tags: list[ItemTagRead] = []

    class Config:
        orm_mode = True

class Restaurant(RestaurantBase):
    id: int
    menu_items: list[MenuItem] = []

    class Config:
        orm_mode = True