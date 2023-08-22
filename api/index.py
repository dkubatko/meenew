from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from .database import models
from .database.crud import CRUD
from .database.database import create_db_and_tables, engine
from sqlmodel import Session
from .database.gcs import GCS
from .core.compute import Compute
from .database import dtos

app = FastAPI()
gcs = GCS()

origins = [
    "*",
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
    return CRUD(db).Restaurant.get_all()

@app.post("/api/restaurant", response_model = models.RestaurantRead)
def create_restaurant(restaurant: models.RestaurantCreate, db: Session = Depends(get_session)):
    return CRUD(db).Restaurant.create(restaurant = restaurant)

@app.get("/api/restaurant/{restaurant_id}", response_model = models.RestaurantRead)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_session)):
    return CRUD(db).Restaurant.get(restaurant_id = restaurant_id)

@app.get("/api/restaurant/{restaurant_id}/category/{category_id}", response_model = models.CategoryTreeRead)
def get_category(restaurant_id: int, category_id: int, db: Session = Depends(get_session)):
    return CRUD(db).Category.get(restaurant_id = restaurant_id, category_id = category_id)

@app.put('/api/category', response_model=models.CategoryLite)
def update_category(category: models.CategoryLite, db: Session = Depends(get_session)):
    return CRUD(db).Category.update(category = category)

@app.post("/api/category", response_model=models.CategoryRead)
def create_category(category: models.CategoryCreate, db: Session = Depends(get_session)):
    return CRUD(db).Category.create(category = category)

@app.post("/api/tag_label", response_model=models.TagLabelRead)
def create_tag_label(tagLabel: models.TagLabelCreate, db: Session = Depends(get_session)):
    return CRUD(db).TagLabel.create(tagLabel = tagLabel)

@app.put('/api/tag_label', response_model=models.TagLabelRead)
def update_tag_label(tagLabel: models.TagLabelRead, db: Session = Depends(get_session)):
    return CRUD(db).TagLabel.update(tagLabel = tagLabel)

@app.delete('/api/tag_label/{tag_label_id}')
def delete_tag_label(tag_label_id: int, db: Session = Depends(get_session)):
    return CRUD(db).TagLabel.delete(tag_label_id = tag_label_id)

@app.post("/api/tag", response_model=models.TagRead)
def create_tag(tag: models.TagCreate, db: Session = Depends(get_session)):
    return CRUD(db).Tag.create(tag = tag)

@app.put('/api/tag', response_model=models.TagRead)
def update_tag(tag: models.TagRead, db: Session = Depends(get_session)):
    return CRUD(db).Tag.update(tag = tag)

@app.delete('/api/tag/{tag_id}')
def delete_tag(tag_id: int, db: Session = Depends(get_session)):
    return CRUD(db).Tag.delete(tag_id = tag_id)

@app.post("/api/menu_item", response_model=models.MenuItemRead)
def create_menu_item(menu_item: models.MenuItemCreate, db: Session = Depends(get_session)):
    return CRUD(db).MenuItem.create(menu_item = menu_item)

@app.post("/api/menu_item_tag", response_model=models.MenuItemRead)
def add_tag_for_menu_item(menu_item_id: int, tag_id: int, db: Session = Depends(get_session)):
    return CRUD(db).MenuItem.add_tag(menu_item_id, tag_id)

@app.post("/api/menu_item_image_upload")
def create_upload_file(image: UploadFile = File(...)):
    # Throws error if image is too large or not in the correct format
    gcs.check_image(image)

    gcs_url = gcs.upload_file(image)
    
    if gcs_url is None:
        raise HTTPException(status_code=400, detail="File upload failed.")
    
    return { "image_url": gcs_url }

@app.put('/api/menu_item', response_model=models.MenuItemRead)
def update_menu_item(menu_item: models.MenuItemRead, db: Session = Depends(get_session)):
    return CRUD(db).MenuItem.update(menu_item = menu_item)

@app.delete('/api/menu_item/{menu_item_id}')
def delete_menu_item(menu_item_id: int, db: Session = Depends(get_session)):
    return CRUD(db).MenuItem.delete(menu_item_id = menu_item_id)

# @app.get("/api/{restaurant_id}/questionnaire", response_model=dtos.Question)
# def get_questionnaire(restaurant_id: int, db: Session = Depends(get_session)):
#     restaurant = models.RestaurantRead.from_orm(crud.get_restaurant(db = db, restaurant_id = restaurant_id))
#     category_tree = models.CategoryTreeRead.from_orm(crud.get_root_tag(db = db))

#     compute = Compute(restaurant, category_tree)
#     return compute.questionnaire()

# @app.post("/api/{restaurant_id}/best-match-item", response_model=models.MenuItemRead)
# def get_best_match_item(restaurant_id: int, tags: List[models.TagRead], db: Session = Depends(get_session)):
#     restaurant = models.RestaurantRead.from_orm(crud.get_restaurant(db = db, restaurant_id = restaurant_id))
#     tag_tree = models.TagTreeRead.from_orm(crud.get_root_tag(db = db))

#     compute = Compute(restaurant, tag_tree)
#     return compute.get_best_match(tags)