from pydantic import BaseModel, conint, confloat, constr
from typing import List, Optional
from models.portfolio_models import Allocation


class PortfolioBuildRequest(BaseModel):
    riskToleranceScore: conint(ge=0, le=100) # type: ignore
    riskCapacityScore: conint(ge=0, le=100) # type: ignore
    tickers: constr(min_length=1)  # type: ignore # e.g. "SPY TLT AAPL GOOG MSFT"
    period: Optional[constr()] = "20y" # type: ignore
    targetReturn: Optional[confloat(ge=0.0, le=1.0)] = None  # type: ignore # override expected return


class AllocationPieData(BaseModel):
    labels: List[str]
    values: List[float]


class PortfolioBuildResponse(BaseModel):
    name: str
    riskBucket: int
    expectedReturn: float
    expectedRisk: float
    allocations: List[Allocation]
    pieData: AllocationPieData