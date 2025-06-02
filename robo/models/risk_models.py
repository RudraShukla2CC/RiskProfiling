from typing import List
from pydantic import BaseModel


class Answer(BaseModel):
    answerText: str
    score: int


class Question(BaseModel):
    questionText: str
    weight: int
    answers: List[Answer]