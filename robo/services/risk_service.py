import json
from pathlib import Path
from typing import List

from models.risk_models import Question

DATA_PATH = Path(__file__).parent.parent / "data"


def load_questions(risk_type: str) -> List[Question]:
    risk_type = risk_type.lower()

    if risk_type == "tolerance":
        filepath = DATA_PATH / "risk_questions_tolerance.json"
    elif risk_type == "capacity":
        filepath = DATA_PATH / "risk_questions_capacity.json"
    else:
        raise ValueError("Risk type must be 'tolerance' or 'capacity'")

    with open(filepath, "r") as f:
        data = json.load(f)

    return [Question(**q) for q in data["questions"]]