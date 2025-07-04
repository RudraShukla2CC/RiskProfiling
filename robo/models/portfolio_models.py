from typing import List
from pydantic import BaseModel

class Allocation(BaseModel):
    ticker: str
    percentage: float

class Portfolio(BaseModel):
    name: str
    riskBucket: str
    expectedReturn: float
    expectedRisk: float
    allocations: List[Allocation]