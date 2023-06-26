from fastapi import FastAPI, Depends, HTTPException
import json
from os.path import join
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from .database import models, crud
from .database.database import create_db_and_tables, engine
from sqlmodel import Session, SQLModel

app = FastAPI()

origins = [
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session():
    with Session(engine) as session:
        yield session

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.get("/restaurants/", response_model = List[models.RestaurantRead])
def get_all_restaurants(db: Session = Depends(get_session)):
    return crud.get_all_restaurants(db = db)

@app.post("/restaurant/", response_model = models.RestaurantRead)
def create_restaurant(restaurant: models.RestaurantCreate, db: Session = Depends(get_session)):
    return crud.create_restaurant(db=db, restaurant = restaurant)

@app.get("/restaurant/{restaurant_id}", response_model = models.RestaurantRead)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_session)):
    return crud.get_restaurant(db = db, restaurant_id = restaurant_id)

@app.post("/tag/", response_model=models.TagRead)
def create_tag(tag: models.TagCreate, db: Session = Depends(get_session)):
    return crud.create_tag(db = db, tag = tag)

@app.get("/tags/", response_model=List[models.TagRead])
def get_all_tags(db: Session = Depends(get_session)):
    return crud.get_all_tags(db = db)

@app.post("/menu_item/", response_model=models.MenuItemRead)
def create_menu_item(menu_item: models.MenuItemCreate, db: Session = Depends(get_session)):
    return crud.create_menu_item(db = db, menu_item = menu_item)

@app.get("/api/{restaurant}/stub")
def stub_data(restaurant: str):
    with open(join('api', 'data', 'sample_data.json'), 'r') as file:
      file_contents = file.read()
    
    data = json.loads(file_contents)
    data['restaurant_name'] = restaurant
    return data