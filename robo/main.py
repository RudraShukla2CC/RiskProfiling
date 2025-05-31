from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from schemas import QuestionnaireGetResponse, QuestionResponse, AnswerOption, QuestionnaireResponse, ScoreResponse
from services import load_questions, calculate_score

app = FastAPI(title="Risk Profiling API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],     
)

@app.get("/questions/{risk_type}", response_model=QuestionnaireGetResponse)
def get_questions(
    risk_type: str = Path(..., pattern="^(tolerance|capacity)$", description="Risk type: Tolerance or Capacity")
):
    try:
        questions = load_questions(risk_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    response_questions = []
    for q in questions:
        response_questions.append(
            QuestionResponse(
                questionText=q.questionText,
                answers=[AnswerOption(answerText=a.answerText) for a in q.answers]
            )
        )
    return {"type": risk_type, "questions": response_questions}

@app.post("/score/{risk_type}", response_model=ScoreResponse)
def post_score(
    data: QuestionnaireResponse,
    risk_type: str = Path(..., pattern="^(Tolerance|Capacity)$", description="Risk type: Tolerance or Capacity")
):
    try:
        questions = load_questions(risk_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    num_questions = len(questions)
    for ans in data.answers:
        if not (0 <= ans.questionIndex < num_questions):
            raise HTTPException(status_code=400, detail=f"Invalid questionIndex: {ans.questionIndex}")
        num_answers = len(questions[ans.questionIndex].answers)
        if not (0 <= ans.answerIndex < num_answers):
            raise HTTPException(status_code=400, detail=f"Invalid answerIndex: {ans.answerIndex} for question {ans.questionIndex}")
    score = calculate_score(questions, [ans.dict() for ans in data.answers])
    return {"riskScore": score}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)