from pydantic import BaseModel
from typing import List, Optional
from .models import TagRead

class Question(BaseModel):
    tag: TagRead
    question_text: Optional[str]
    children: List['Question']