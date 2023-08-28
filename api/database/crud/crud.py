from sqlmodel import Session
from .restaurant import RestaurantCRUD
from .category import CategoryCRUD
from .menu_item import MenuItemCRUD
from .tag import TagCRUD
from .tag_label import TagLabelCRUD

class CRUD:
    def __init__(self, db: Session):
        self.Restaurant = RestaurantCRUD(db)
        self.MenuItem = MenuItemCRUD(db)
        self.Category = CategoryCRUD(db)
        self.Tag = TagCRUD(db)
        self.TagLabel = TagLabelCRUD(db)