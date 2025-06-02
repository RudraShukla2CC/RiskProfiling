from fastapi import APIRouter, HTTPException
from schemas.portfolio_schemas import PortfolioBuildRequest, PortfolioBuildResponse, AllocationPieData
from services.portfolio_service import PortfolioService

router = APIRouter()
portfolio_service = PortfolioService()


@router.post("/build", response_model=PortfolioBuildResponse)
def build_portfolio(request: PortfolioBuildRequest):
    try:
        portfolio = portfolio_service.build_portfolio(
            riskToleranceScore=request.riskToleranceScore,
            riskCapacityScore=request.riskCapacityScore,
            tickers=request.tickers,
            period=request.period,
            targetReturn=request.targetReturn,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    labels = [allocation.ticker for allocation in portfolio.allocations]
    values = [allocation.percentage for allocation in portfolio.allocations]

    pie_data = AllocationPieData(labels=labels, values=values)

    return PortfolioBuildResponse(
        name=portfolio.name,
        riskBucket=portfolio.riskBucket,
        expectedReturn=portfolio.expectedReturn,
        expectedRisk=portfolio.expectedRisk,
        allocations=portfolio.allocations,
        pieData=pie_data,
    )