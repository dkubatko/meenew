'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from "react";
import { Tag as TagType, TagLabel as TagLabelType } from "@/app/types/tag";
import MenuItemType from "@/app/types/menuItem";
import TagLabel from "@/app/components/shared/tagLabel.component";
import styles from "@/app/components/owner/restaurant.module.css";
import sharedStyles from "@/app/components/shared/shared.module.css";
import Modal from 'react-overlays/Modal';
import TagModal from "@/app/components/owner/tagOrLabelModal.component";
import MenuItemModal, { MenuItemFormData } from "./menuItemModal.component";
import { ServerAPIClient } from "@/app/api/APIClient";
import { CategoryLite, CategoryTree } from "@/app/types/category";
import CategoryView from "./categoryView.component";
import RestaurantType from '@/app/types/restaurant';
import InlineInputButton from '../shared/inlineInputButton.component';

interface RestaurantViewProps {
  restaurant: any,
  category: any
}

export default function RestaurantView({ restaurant, category }: RestaurantViewProps) {
  const router = useRouter();

  const [restaurantData, setRestaurantData] = useState<RestaurantType>(RestaurantType.fromObject(restaurant));
  const [categoryData, setCategoryData] = useState<CategoryTree>(CategoryTree.fromObject(category));

  const [currentTagLabels, setCurrentTagLabels] = useState<TagLabelType[]>(categoryData?.tag_labels || []);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(categoryData?.menu_items || []);

  // Update current tags to be displayed based on retrieved category.
  useEffect(() => {
    setCurrentTagLabels(categoryData?.tag_labels || []);
  }, [categoryData]);

  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [selectedTagLabel, setSelectedTagLabel] = useState<TagLabelType>();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType>();

  const [showNewTagModal, setShowNewTagModal] = useState<boolean>(false);
  const [showEditTagModal, setShowEditTagModal] = useState<boolean>(false);
  const [showEditTagLabelModal, setShowEditTagLabelModal] = useState<boolean>(false);
  const [showEditMenuItemModal, setShowEditMenuItemModal] = useState<boolean>(false);
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState<boolean>(false);

  function Backdrop(onClick: () => void) {
    return (
      <div
        className={styles.backdrop}
        onClick={onClick}
      />
    )
  }

  function handleEditTagLabelClick(tagLabel: TagLabelType) {
    setSelectedTagLabel(tagLabel);
    setShowEditTagLabelModal(true);
  }

  function handleAddTag(newTag: TagType) {
    setCurrentTagLabels(prevTagLabels => {
      return prevTagLabels.map(tagLabel => {
        if (tagLabel.id === newTag.label_id) {
          return {
            ...tagLabel,
            tags: [...tagLabel.tags, newTag], // Add the new tag to the tags array of the matching tagLabel
          };
        }
        return tagLabel; // Return other tagLabels unmodified
      });
    });
  }
  

  async function handleDeleteTag(deletedTag: TagType) {
    // Update tag labels
    setCurrentTagLabels(prevTagLabels => {
      return prevTagLabels.map(tagLabel => {
        if (tagLabel.id === deletedTag.label_id) {
          return {
            ...tagLabel,
            tags: tagLabel.tags.filter(tag => tag.id !== deletedTag.id), // Remove the deleted tag
          };
        }
        return tagLabel; // Return other tagLabels unmodified
      });
    });

    // Update menu items by removing the deleted tag.
    setCategoryData(categoryData => {
      return {
        ...categoryData,
        menu_items: categoryData.menu_items.map((menuItem) => {
          return {
            ...menuItem,
            tags: menuItem.tags.filter((t: TagType) => t.id !== deletedTag.id), // Filter out the deleted tag
          };
        }),
      };
    });
  }

  async function handleEditTag(updatedTag: TagType) {
    // Update tag labels
    setCurrentTagLabels(prevTagLabels => {
      return prevTagLabels.map(tagLabel => {
        if (tagLabel.id === updatedTag.label_id) {
          return {
            ...tagLabel,
            tags: tagLabel.tags.map(tag => 
              tag.id === updatedTag.id ? updatedTag : tag // Replace the edited tag
            ),
          };
        }
        return tagLabel; // Return other tagLabels unmodified
      });
    });

    // Update menu items by replacing the edited tag.
    setCategoryData(categoryData => {
      return {
        ...categoryData,
        menu_items: categoryData.menu_items.map((menuItem) => {
          return {
            ...menuItem,
            tags: menuItem.tags.map((tag: TagType) => tag.id === updatedTag.id ? updatedTag : tag),
          };
        }),
      };
    });
  }

  async function handleAddTagLabel(tagLabel: TagLabelType) {
    const createdTagLabel = await ServerAPIClient.Tag.createLabel(tagLabel);

    if (!createdTagLabel) {
      console.error('An error occurred while creating a tag');
      return;
    }

    // Update tag labels
    setCurrentTagLabels([...currentTagLabels, createdTagLabel]);
  }

  const handleCategoryClick = (category: CategoryLite) => {
    router.push(`/restaurant/${restaurant.id}/category/${category.id}`);
  };

  return (
    <div className={styles.restaurantView}>
      <div className={styles.restaurantName}>
        {restaurantData?.restaurant_name}
      </div>
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className={styles.title}>Menu</div>
          <div className={styles.itemlist}>
            {categoryData &&
              <CategoryView
                categoryTree={categoryData}
                tagLabels={currentTagLabels}
                handleCategoryClick={handleCategoryClick}
              />
            }
          </div>
        </div>
        <div className={styles.tags}>
          <div className={styles.title}>Tags</div>
          <div className={styles.taglist}>
            {/* TODO: Separate into a standalone component */}
            {
              currentTagLabels && currentTagLabels.map(
                (tagLabel: TagLabelType) =>
                  <TagLabel
                    key={tagLabel.id}
                    tagLabel={tagLabel}
                    postAddTag={handleAddTag}
                    onEditTagLabel={handleEditTagLabelClick}
                    postEditTag={handleEditTag}
                    postDeleteTag={handleDeleteTag}
                  />
              )
            }
            <InlineInputButton
              onSubmit={(name: string) => {
                const tagLabel = TagLabelType.new(categoryData.id);
                tagLabel.name = name;
                handleAddTagLabel(tagLabel);
              }}
              className={sharedStyles.inputButton}
            >
              Add tag label
            </InlineInputButton>
          </div>
        </div>
      </div>
    </div>
  )
}