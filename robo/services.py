import json
from typing import List
from pathlib import Path

from models import Question, Answer

DATA_PATH = Path(__file__).parent / "data"

def load_questions(risk_type: str) -> List[Question]:
    filepath = None
    if risk_type.lower() == "tolerance":
        filepath = DATA_PATH / "risk_questions_tolerance.json"
    elif risk_type.lower() == "capacity":
        filepath = DATA_PATH / "risk_questions_capacity.json"
    else:
        raise ValueError("Type must be 'Tolerance' or 'Capacity'")

    with open(filepath, "r") as f:
        data = json.load(f)
    questions = [Question(**q) for q in data["questions"]]
    return questions


def calculate_score(questions: List[Question], answers: List[dict]) -> int:
    """
    answers: list of dict with keys: questionIndex and answerIndex
    """
    total_score = 0
    for ans in answers:
        q_idx = ans["questionIndex"]
        a_idx = ans["answerIndex"]
        question = questions[q_idx]
        answer = question.answers[a_idx]
        total_score += answer.score * question.weight
    return total_score