import React, { useState, useEffect } from "react";
import styles from "@/app/components/results.module.css";
import { Tag as TagType } from "@/app/types/tag";
import MenuItem from "@/app/components/shared/menuItem.component";
import { ServerAPIClient } from "@/app/api/APIClient";
import MenuItemType from "@/app/types/menuItem";
import { ThreeDots } from "react-loader-spinner";

interface ResultsProps {
  restaurantId: string;
  selectedTagIds: number[];
}

export default function Results({ restaurantId, selectedTagIds }: ResultsProps) {
  const [menuItem, setMenuItem] = useState<MenuItemType | null>(null);

  useEffect(() => {
    async function fetchBestMatch() {
      const result = await ServerAPIClient.Restaurant.get_best_match_item(restaurantId, selectedTagIds);
      setMenuItem(result);
    }

    fetchBestMatch();
  }, [selectedTagIds, restaurantId]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your best match:</div>
      <div className={styles.item}>
        {
          menuItem ?
            <MenuItem menu_item={menuItem} /> :
            <ThreeDots
              height="10vh"
              width="200"
              radius="7"
              color="#ff9d1b"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
        }
      </div>
    </div>
  );
}
