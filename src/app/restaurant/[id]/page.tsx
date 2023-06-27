import { useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Restaurant from "@/app/components/owner/restaurant.component";
import { Tag } from "@/app/types/menu";

async function getTags(): Promise<any> {
  const res = await fetch('http://127.0.0.1:8000/api/tags/')

  return res.json();
}

export default async function RestaurantPage() {
  const tags = await getTags();
   
  return (
    <Restaurant tags={tags}></Restaurant>
  )
}