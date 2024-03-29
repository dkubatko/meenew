from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .TagLabel import TagLabel, TagLabelRead
    from .MenuItem import MenuItem, MenuItemRead
    from .Restaurant import Restaurant

class CategoryBase(SQLModel):
    name: str = Field(unique=True, index=True)
    restaurant_id: int = Field(foreign_key="restaurants.id", index=True)  # Link to a specific restaurant

class Category(CategoryBase, table=True):
    __tablename__: str = "categories"

    id: Optional[int] = Field(default=None, primary_key=True, index=True, nullable=False)
    parent_id: Optional[int] = Field(default=None, foreign_key="categories.id", nullable=True)

    parent: Optional["Category"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs=dict(remote_side="Category.id")
    )

    children: List["Category"] = Relationship(back_populates="parent")
    menu_items: List['MenuItem'] = Relationship(back_populates="category")
    tag_labels: List['TagLabel'] = Relationship(back_populates="category")

class CategoryLite(CategoryBase):
    id: int
    parent: Optional['CategoryLite'] = None

class CategoryRead(CategoryBase):
    id: int
    parent: Optional['CategoryLite'] = None
    menu_items: List['MenuItemRead'] = []
    tag_labels: List['TagLabelRead'] = []

class CategoryTreeRead(CategoryBase):
    id: int
    parent: Optional['CategoryLite'] = None
    children: List["CategoryRead"] = []
    menu_items: List['MenuItemRead'] = []
    tag_labels: List['TagLabelRead'] = []

    def toCategoryRead(self) -> CategoryRead:
        return CategoryRead(
            name=self.name,
            menu_items=self.menu_items,
            id=self.id,
            parent_id=self.parent_id
        )
    
class CategoryTreeLite(CategoryBase):
    id: int
    children: List["CategoryTreeLite"] = []
    tag_labels: List['TagLabelRead'] = []

class CategoryCreate(CategoryBase):
    restaurant_id: int
    parent_id: int
