export type Restaurant = {
  id: number
  restaurant_name: string  
  menu_items: MenuItem[]
}

export type Tag = {
  id: number
  name: string
}

export type MenuItem = {
  id: number
  item_name: string
  image_path: string
  tags: Tag[]
}



