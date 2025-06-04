from typing import List, Optional
from pydantic import BaseModel, conint


class QuestionAnswersSchema(BaseModel):
    questionIndex: conint(ge=0) # type: ignore
    answerIndex: conint(ge=0) # type: ignore


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


class QuestionScore(BaseModel):
    questionText: str
    score: int


class ScoreWithCategoryResponse(BaseModel):
    totalScore: int
    perQuestionScores: List[QuestionScore]
    category: str
    bucket: Optional[str] = None 