from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from os.path import join
from fastapi.middleware.cors import CORSMiddleware
from .database.models import models, schemas
from .database.database import SessionLocal, engine
from .database import crud

models.Base.metadata.create_all(bind=engine)

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

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.post("/restaurant/", response_model=schemas.Restaurant)
def create_restaurant(restaurant: schemas.Restaurant, db: Session = Depends(get_db)):
    return crud.create_restaurant(db=db, restaurant=restaurant)

@app.post("/tag/", response_model=schemas.Tag)
def create_tag(tag: schemas.Tag, db: Session = Depends(get_db)):
    return crud.create_tag(db = db, tag = tag)

@app.post("/menu_item/", response_model=schemas.MenuItem)
def create_menu_item(menu_item: schemas.MenuItem, db: Session = Depends(get_db)):
    return crud.create_menu_item(db = db, item=menu_item)

@app.post("/item_tag/", response_model=schemas.ItemTag)
def create_item_tag(item_tag: schemas.ItemTag, db: Session = Depends(get_db)):
    return crud.create_item_tag(db = db, item_tag=item_tag)


@app.get("/restaurants/", response_model=list[schemas.Restaurant])
def get_all_restaurants(db: Session = Depends(get_db)):
    return crud.get_all_restaurants(db = db)

@app.get("/tags/", response_model=list[schemas.Tag])
def get_all_tags(db: Session = Depends(get_db)):
    return crud.get_all_tags(db = db)

@app.get("/api/{restaurant}/stub")
def stub_data(restaurant: str):
    with open(join('api', 'data', 'sample_data.json'), 'r') as file:
      file_contents = file.read()
    
    data = json.loads(file_contents)
    data['restaurant_name'] = restaurant
    return data