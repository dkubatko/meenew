from fastapi import FastAPI, Depends, Form, HTTPException, UploadFile, File
import json
from os.path import join
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from .database import models, crud
from .database.database import create_db_and_tables, engine
from sqlmodel import Session, SQLModel
from .database.gcs import GCS

app = FastAPI()
gcs = GCS()

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

@app.get("/api/restaurants", response_model = List[models.RestaurantRead])
def get_all_restaurants(db: Session = Depends(get_session)):
    return crud.get_all_restaurants(db = db)

@app.post("/api/restaurant", response_model = models.RestaurantRead)
def create_restaurant(restaurant: models.RestaurantCreate, db: Session = Depends(get_session)):
    return crud.create_restaurant(db=db, restaurant = restaurant)

@app.get("/api/restaurant/{restaurant_id}", response_model = models.RestaurantRead)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_session)):
    return crud.get_restaurant(db = db, restaurant_id = restaurant_id)

@app.post("/api/tag", response_model=models.TagRead)
def create_tag(tag: models.TagCreate, db: Session = Depends(get_session)):
    return crud.create_tag(db = db, tag = tag)

@app.delete('/api/tag/{tag_id}')
def delete_tag(tag_id: int, db: Session = Depends(get_session)):
    return crud.delete_tag(db = db, tag_id = tag_id)

@app.get("/api/tags", response_model=List[models.TagRead])
def get_all_tags(db: Session = Depends(get_session)):
    return crud.get_all_tags(db = db)

@app.get("/api/tag_tree", response_model=models.TagTreeRead)
def get_tag_tree(db: Session = Depends(get_session)):
    return crud.get_root_tag(db = db)

@app.post("/api/menu_item", response_model=models.MenuItemRead)
def create_menu_item(menu_item: models.MenuItemCreate, db: Session = Depends(get_session)):
    return crud.create_menu_item(db = db, menu_item = menu_item)

@app.post("/api/menu_item_tag", response_model=models.MenuItemRead)
def add_tag_for_menu_item(menu_item_id: int, tag_id: int, db: Session = Depends(get_session)):
    return crud.add_tag_for_menu_item(db, menu_item_id, tag_id)

@app.post("/api/menu_item_image_upload", response_model=models.MenuItemRead)
def create_upload_file(menu_item_id: int = Form(...), image: UploadFile = File(...), db: Session = Depends(get_session)):
    gcs_url = gcs.upload_file(image)
    
    if gcs_url is None:
        raise HTTPException(status_code=400, detail="File upload failed.")
    
    return crud.add_image_url_to_menu_item(db, menu_item_id, gcs_url)

@app.get("/api/{restaurant}/stub")
def stub_data(restaurant: str):
    with open(join('api', 'data', 'sample_data.json'), 'r') as file:
      file_contents = file.read()
    
    data = json.loads(file_contents)
    data['restaurant_name'] = restaurant
    return data