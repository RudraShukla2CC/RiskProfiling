from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from schemas import QuestionnaireGetResponse, QuestionResponse, AnswerOption, QuestionnaireResponse, ScoreWithCategoryResponse, QuestionScore
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

@app.post("/score/{risk_type}", response_model=ScoreWithCategoryResponse)
def post_score(
    data: QuestionnaireResponse,
    risk_type: str = Path(..., pattern="^(tolerance|capacity)$", description="Risk type: Tolerance or Capacity")
):
    try:
        questions = load_questions(risk_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    num_questions = len(questions)
    total_score = 0
    per_question_scores = []

    # Calculate per-question score
    for ans in data.answers:
        if not (0 <= ans.questionIndex < num_questions):
            raise HTTPException(status_code=400, detail=f"Invalid questionIndex: {ans.questionIndex}")
        question = questions[ans.questionIndex]
        num_answers = len(question.answers)
        if not (0 <= ans.answerIndex < num_answers):
            raise HTTPException(status_code=400, detail=f"Invalid answerIndex: {ans.answerIndex} for question {ans.questionIndex}")
        answer_score = question.answers[ans.answerIndex].score * question.weight
        total_score += answer_score
        per_question_scores.append(QuestionScore(questionText=question.questionText, score=answer_score))

    # Determine categories by dividing range into 3
    # First find max possible total score (sum of max scores * weights)
    max_total_score = 0
    for question in questions:
        max_answer_score = max(ans.score for ans in question.answers)
        max_total_score += max_answer_score * question.weight

    # Categories thresholds
    category_threshold = max_total_score / 3

    if total_score <= category_threshold:
        category = "Low"
    elif total_score <= 2 * category_threshold:
        category = "Medium"
    else:
        category = "High"

    return ScoreWithCategoryResponse(
        totalScore=total_score,
        perQuestionScores=per_question_scores,
        category=category
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)