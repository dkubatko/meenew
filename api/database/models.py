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

class RestaurantRead(RestaurantBase):
    id: int
    menu_items: List["MenuItemRead"] = []

class RestaurantCreate(RestaurantBase):
    pass

class MenuItemBase(SQLModel):
    item_name: str = Field(unique=True, index=True)

class MenuItem(MenuItemBase, table = True):
    __tablename__: str = "menuitems"

    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    restaurant_id: Optional[int] = Field(default = None, foreign_key="restaurants.id")
    image_path: Optional[str] = Field(default = None)
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    category: Optional["Category"] = Relationship(back_populates="menu_items")
    restaurant: Optional[Restaurant] = Relationship(back_populates="menu_items")
    tags: List["Tag"] = Relationship(back_populates="menu_items", link_model=ItemTagLink)

class MenuItemCreate(MenuItemBase):
    restaurant_id: int
    image_path: Optional[str]
    tags: List["TagRead"]

class MenuItemRead(MenuItemBase):
    id: int
    image_path: Optional[str]
    tags: List["TagRead"] = []

class CategoryBase(SQLModel):
    name: str = Field(unique=True, index=True)

class Category(CategoryBase, table=True):
    __tablename__: str = "categories"

    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    parent_id: Optional[int] = Field(default=None, foreign_key="categories.id", nullable=True)

    parent: Optional["Category"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs=dict(remote_side="Category.id")
    )
    children: List["Category"] = Relationship(back_populates="parent")
    menu_items: List["MenuItem"] = Relationship(back_populates="category")

class CategoryRead(CategoryBase):
    id: int
    parent_id: Optional[int]
    menu_items: List["MenuItem"] = []

class CategoryTreeRead(CategoryBase):
    id: int
    parent_id: Optional[int]
    children: List["CategoryTreeRead"] = []
    menu_items: List["MenuItem"]

    def toCategoryRead(self) -> CategoryRead:
        return CategoryRead(
            name=self.name,
            menu_items=self.menu_items,
            id=self.id,
            parent_id=self.parent_id
        )

class CategoryCreate(CategoryBase):
    parent_id: int

class TagLabelBase(SQLModel):
    name: str = Field(unique=True, index=True)

class TagLabel(TagLabelBase, table=True):
    __tablename__: str = "taglabels"
    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    tags: List["Tag"] = Relationship(back_populates="taglabel")

class TagBase(SQLModel):
    name: str = Field(unique=True, index=True)
    label_id: Optional[int] = Field(default=None, foreign_key="taglabels.id", nullable=True)

class Tag(TagBase, table=True):
    __tablename__: str = "tags"
    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)

    label: Optional["TagLabel"] = Relationship(back_populates="tags")
    menu_items: List["MenuItem"] = Relationship(back_populates="tags", link_model=ItemTagLink)

class TagRead(TagBase):
    id: int

class TagCreate(TagBase):
    parent_id: int