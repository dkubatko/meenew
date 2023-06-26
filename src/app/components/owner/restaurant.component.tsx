'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, Restaurant as RestaurantType, MenuItem as MenuItemType } from "@/app/types/menu";
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";

export default function Restaurant() {
  const [restaurantData, setRestaurantData] = useState<RestaurantType>();
  const searchParams = useSearchParams();
  const { restaurant_name = "", menu_items = [] } = restaurantData || {};
  
  useEffect(() => {
    fetch(`/api/restaurant/${searchParams.get('id') ?? '0'}`)
      .then((res) => res.json())
      .then((data: RestaurantType) => {
        setTimeout(() => {
          setRestaurantData(data);
        }, 2000);
      });
    }, [searchParams]);

  return (
    <div className={styles.container}>
      <div>
        {
          menu_items.map((menu_item: MenuItemType) => (
            <MenuItem key={menu_item.id} {...menu_item} />
          ))
        }
      </div>
      <div>
        Tags
      </div>
    </div>
  )
}