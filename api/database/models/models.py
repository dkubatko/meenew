from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Date
from ..database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_name = Column(String, unique=True, index=True)
    menu_items = relationship("MenuItem", back_populates="restaurant")

class MenuItem(Base):
    __tablename__ = "menuitems"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, unique=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    
    restaurant = relationship("Restaurant", back_populates="menu_items")
    item_tags = relationship("ItemTag", back_populates="menu_item")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    item_tags = relationship("ItemTag", back_populates="tag")

class ItemTag(Base):
    __tablename__ = "itemtags"

    id = Column(Integer, primary_key=True, index=True)
    tag_id = Column(Integer, ForeignKey("tags.id"))
    menu_item_id = Column(Integer, ForeignKey("menuitems.id"))
    
    tag = relationship("Tag", back_populates="item_tags")
    menu_item = relationship("MenuItem", back_populates="item_tags")
  
