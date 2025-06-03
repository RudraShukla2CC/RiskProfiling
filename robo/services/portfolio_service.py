from pathlib import Path
import pandas as pd
import yfinance as yf
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models, expected_returns

from models.portfolio_models import Allocation, Portfolio

DATA_PATH = Path(__file__).parent.parent / "data"
ALLOCATION_LOOKUP_CSV = DATA_PATH / "Risk Mapping Lookup.csv"


class PortfolioService:
    def __init__(self):
        self.allocation_lookup_table = pd.read_csv(ALLOCATION_LOOKUP_CSV)

    def get_portfolio_id(self, riskToleranceScore: int, riskCapacityScore: int) -> int:
        match_tol = (
            (self.allocation_lookup_table["Tolerance_min"] <= riskToleranceScore)
            & (self.allocation_lookup_table["Tolerance_max"] >= riskToleranceScore)
        )
        match_cap = (
            (self.allocation_lookup_table["Capacity_min"] <= riskCapacityScore)
            & (self.allocation_lookup_table["Capacity_max"] >= riskCapacityScore)
        )
        matched_rows = self.allocation_lookup_table[match_tol & match_cap]
        if matched_rows.empty:
            raise ValueError("No portfolio found for given risk tolerance and capacity")
        portfolio_id = int(matched_rows["Portfolio"].values[0])
        return portfolio_id

    def get_portfolio_name_and_default_return(self, riskBucket: int):
        mapping = {
            1: ("Conservative", 0.08),
            2: ("Moderate", 0.1),
            3: ("Moderate Growth", 0.12),
            4: ("Growth", 0.14),
            5: ("Aggressive Growth", 0.17),
        }
        if riskBucket not in mapping:
            raise ValueError("Invalid risk bucket")
        return mapping[riskBucket]

    def get_daily_prices(self, tickers: str, period: str):
        data = yf.download(tickers, group_by="Ticker", period=period)
        if isinstance(data.columns, pd.MultiIndex):
            data = data.iloc[:, data.columns.get_level_values(1) == "Close"]
            data = data.dropna()
            data.columns = data.columns.droplevel(1)
        else:
            data = data["Close"].to_frame()
        return data

    def build_portfolio(
        self,
        riskToleranceScore: int,
        riskCapacityScore: int,
        tickers: str,
        period: str = "20y",
        targetReturn: float | None = None,
    ) -> Portfolio:
        # Find portfolio ID from scores
        portfolio_id = self.get_portfolio_id(riskToleranceScore, riskCapacityScore)
        portfolio_name, default_return = self.get_portfolio_name_and_default_return(portfolio_id)

        # Effective expected return
        expected_return = targetReturn if targetReturn is not None else default_return

        # Fetch price data
        df = self.get_daily_prices(tickers, period)

        # Calc mu, cov
        mu = expected_returns.mean_historical_return(df)
        S = risk_models.sample_cov(df)

        # Optimize portfolio to efficient return target
        ef = EfficientFrontier(mu, S)
        ef.efficient_return(expected_return)

        expected_risk = ef.portfolio_performance()[1]
        weights = ef.clean_weights()

        allocations = [Allocation(ticker=k, percentage=v) for k, v in weights.items()]

        return Portfolio(
            name=portfolio_name,
            riskBucket=portfolio_id,
            expectedReturn=expected_return,
            expectedRisk=expected_risk,
            allocations=allocations,
        )