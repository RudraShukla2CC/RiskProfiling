from fastapi import APIRouter, HTTPException, Path

from schemas.risk_schemas import (
    QuestionnaireGetResponse,
    QuestionResponse,
    AnswerOption,
    QuestionnaireResponse,
    ScoreWithCategoryResponse,
    QuestionScore,
)
from services.risk_service import load_questions

router = APIRouter()


@router.get("/questions/{risk_type}", response_model=QuestionnaireGetResponse)
def get_questions(
    risk_type: str = Path(..., regex="^(tolerance|capacity)$", description="Risk type: 'tolerance' or 'capacity'")
):
    try:
        questions = load_questions(risk_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    response_questions = [
        QuestionResponse(
            questionText=q.questionText,
            answers=[AnswerOption(answerText=a.answerText) for a in q.answers],
        )
        for q in questions
    ]

    return {"type": risk_type, "questions": response_questions}


@router.post("/score/{risk_type}", response_model=ScoreWithCategoryResponse)
def post_score(
    data: QuestionnaireResponse,
    risk_type: str = Path(..., regex="^(tolerance|capacity)$", description="Risk type: 'tolerance' or 'capacity'"),
):
    try:
        questions = load_questions(risk_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    num_questions = len(questions)
    total_score = 0
    per_question_scores = []

    # Validate answers and compute scores
    for ans in data.answers:
        if not (0 <= ans.questionIndex < num_questions):
            raise HTTPException(status_code=400, detail=f"Invalid questionIndex: {ans.questionIndex}")

        question = questions[ans.questionIndex]

        if not (0 <= ans.answerIndex < len(question.answers)):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid answerIndex: {ans.answerIndex} for question {ans.questionIndex}",
            )

        answer_score = question.answers[ans.answerIndex].score * question.weight
        total_score += answer_score
        per_question_scores.append(QuestionScore(questionText=question.questionText, score=answer_score))

    # Calculate max possible score
    max_total_score = sum(max(ans.score for ans in q.answers) * q.weight for q in questions)
    category_threshold = max_total_score / 3

    if total_score <= category_threshold:
        category = "Low"
    elif total_score <= 2 * category_threshold:
        category = "Medium"
    else:
        category = "High"

    return ScoreWithCategoryResponse(totalScore=total_score, perQuestionScores=per_question_scores, category=category)