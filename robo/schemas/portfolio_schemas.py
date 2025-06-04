from pydantic import BaseModel, conint, constr
from typing import List, Literal

class Allocation(BaseModel):
    ticker: str
    percentage: float

class AllocationPieData(BaseModel):
    labels: List[str]
    values: List[float]

class PortfolioBuildRequest(BaseModel):
    riskBucketCategory: Literal["Conservative", "Moderate", "Growth", "Aggressive Growth"]
    tickers: constr(min_length=1) # type: ignore

class PortfolioBuildResponse(BaseModel):
    name: str
    riskBucket: str  # using str to represent bucket name
    expectedReturn: float
    expectedRisk: float
    allocations: List[Allocation]
    pieData: AllocationPieData