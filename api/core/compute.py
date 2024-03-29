from copy import deepcopy
from ..database.models import RestaurantRead, TagRead, MenuItemRead
from typing import List

class Compute:
    def __init__(self, restaurant: RestaurantRead):
        self.restaurant = restaurant
    
    def get_best_match(self, tags: List[TagRead], category_ids: List[int]) -> MenuItemRead:
        # Fetch all menu items of the restaurant
        menu_items = self.restaurant.menu_items

        # Filter menu items by categories
        if category_ids:
            menu_items = [item for item in menu_items if item.category_id in category_ids]

        max_overlap = 0
        best_match = None

        for item in menu_items:
            overlap_count = len(set([tag.id for tag in item.tags]).intersection([tag.id for tag in tags]))
            if overlap_count > max_overlap:
                max_overlap = overlap_count
                best_match = item

        return MenuItemRead.from_orm(best_match) if best_match else best_match
