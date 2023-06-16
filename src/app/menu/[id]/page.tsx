import { useState, useEffect, useRef } from 'react';
import Questionnaire from '@/app/components/questionnaire.component';

// TODO:
// [X] fix side buttons
// [X] fix circular translate
// [X] Update circular translate to use parabolic func
// [X] Switch back and skip to arrows
// [X] Progress bar
// [X] Fix animations stuck after one
// [X] Make responsive
// [X] Add FastAPI server + connect
// [X] Split into client and server components
// [ ] Fix 'not defined' for client-side functions on the server render
// [ ] Fix image boxing to not cover buttons
// [ ] github
// [ ] Deploy to vercel
// [ ] Refactor code into components
// [ ] add entry / final conditions
// [ ] add cat animations


async function getData() {
  const res = await fetch('http://127.0.0.1:8000/api/Spot/stub');
 
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export default async function Main() {
  const data = await getData();

  return (
    <Questionnaire restaurant_data={data}></Questionnaire>
  );
}