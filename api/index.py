from fastapi import FastAPI
import json
from os.path import join

# [ ] Add database integration
# [ ] Add endpoint to add a menu to the database
# [ ] Add endpoint to retrieve questionnaire for a restaurant

app = FastAPI()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.get("/api/{restaurant}/stub")
def stub_data(restaurant: str):
    with open(join('api', 'data', 'sample_data.json'), 'r') as file:
      file_contents = file.read()
    
    data = json.loads(file_contents)
    data['restaurant_name'] = restaurant
    return data