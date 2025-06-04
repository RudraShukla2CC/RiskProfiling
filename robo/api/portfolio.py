from fastapi import APIRouter, HTTPException
from schemas.portfolio_schemas import Allocation, PortfolioBuildRequest, PortfolioBuildResponse, AllocationPieData
from services.portfolio_service import PortfolioService

router = APIRouter()
portfolio_service = PortfolioService()

@router.post("/build", response_model=PortfolioBuildResponse)
def build_portfolio(request: PortfolioBuildRequest):
    try:
        portfolio = portfolio_service.build_portfolio(
            riskBucketCategory=request.riskBucketCategory,
            tickers=request.tickers,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    allocations = [
        Allocation(ticker=alloc.ticker, percentage=alloc.percentage)
        for alloc in portfolio.allocations
    ]
    labels = [alloc.ticker for alloc in allocations]
    values = [alloc.percentage for alloc in allocations]
    pie_data = AllocationPieData(labels=labels, values=values)

    return PortfolioBuildResponse(
        name=portfolio.name,
        riskBucket=portfolio.riskBucket,
        expectedReturn=portfolio.expectedReturn,
        expectedRisk=portfolio.expectedRisk,
        allocations=allocations,
        pieData=pie_data,
    )