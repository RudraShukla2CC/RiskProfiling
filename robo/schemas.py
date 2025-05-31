from typing import List
from pydantic import BaseModel, conint

class AnswerSchema(BaseModel):
    answerIndex: conint(ge=0) 

class QuestionAnswersSchema(BaseModel):
    questionIndex: conint(ge=0)
    answerIndex: conint(ge=0)

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

class ScoreResponse(BaseModel):
    riskScore: int