from typing import List
from pydantic import BaseModel, conint

class AnswerSchema(BaseModel):
    answerIndex: conint(ge=0)  # selected answer index for a question

class QuestionAnswersSchema(BaseModel):
    questionIndex: conint(ge=0)  # question index
    answerIndex: conint(ge=0)    # selected answer index

class QuestionnaireResponse(BaseModel):
    answers: List[QuestionAnswersSchema]

class AnswerOption(BaseModel):
    answerText: str

class QuestionResponse(BaseModel):
    questionText: str
    answers: List[AnswerOption]

class QuestionnaireGetResponse(BaseModel):
    type: str
    questions: List[QuestionResponse]

# New schema for score per question + category

class QuestionScore(BaseModel):
    questionText: str
    score: int

class ScoreWithCategoryResponse(BaseModel):
    totalScore: int
    perQuestionScores: List[QuestionScore]
    category: str