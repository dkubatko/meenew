'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Tag as TagType, Restaurant as RestaurantType, MenuItem as MenuItemType } from "@/app/types/menu";
import styles from "@/app/components/owner/restaurant.module.css";
import MenuItem from "@/app/components/shared/menu_item.component";

interface RestaurantProps {
  tags: TagType[]
}

export default function Restaurant({ tags }: RestaurantProps) {
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
      <div className={styles.itemlist}>
        {
          menu_items.map((menu_item: MenuItemType) => (
            <MenuItem key={menu_item.id} {...menu_item} />
          ))
        }
      </div>
      <div className={styles.taglist}>
        {
          tags.map((tag: TagType) => (
            <h1 key={tag.id}>{tag.name}</h1>
          ))
        }
      </div>
    </div>
  )
}