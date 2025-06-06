from pathlib import Path
import traceback
import pandas as pd
import yfinance as yf
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models, expected_returns
from models.portfolio_models import Allocation, Portfolio

class PortfolioService:
    def __init__(self):
        pass  

    bucket_to_target_returns = {
        "Conservative": [round(x * 0.01, 2) for x in range(5, 7)],  # 0.05 to 0.06
        "Moderate": [round(x * 0.01, 2) for x in range(8, 11)],     # 0.08 to 0.10
        "Growth": [round(x * 0.01, 2) for x in range(12, 14)],      # 0.12 to 0.13
        "Aggressive Growth": [round(x * 0.01, 2) for x in range(15, 20)],  # 0.15 to 0.19
    }

    def get_daily_prices(self, tickers: str, period: str = "10y"):
        data = yf.download(tickers, group_by="Ticker", period=period, progress=False)
        if isinstance(data.columns, pd.MultiIndex):
            data = data.iloc[:, data.columns.get_level_values(1) == "Close"]
            data = data.dropna()
            data.columns = data.columns.droplevel(1)
        else:
            data = data["Close"].to_frame()
        if data.empty:
            raise ValueError("No price data fetched for the given tickers")
        return data

    def build_portfolio_for_return(self, mu, S, target_return):
        ef = EfficientFrontier(mu, S)
        ef.efficient_return(target_return)
        cleaned_weights = ef.clean_weights()
        expected_return, expected_risk, _ = ef.portfolio_performance()
        allocations = [Allocation(ticker=k, percentage=v) for k, v in cleaned_weights.items()]
        risk_free_rate = 0.046
        excess_return = expected_return - risk_free_rate
        sharpe_ratio = excess_return / expected_risk if expected_risk > 0 else 0
        return expected_return, expected_risk, allocations, sharpe_ratio

    def build_portfolio(self, riskBucketCategory: str, tickers: str) -> Portfolio:
        if riskBucketCategory not in self.bucket_to_target_returns:
            raise ValueError(f"Invalid riskBucketCategory: {riskBucketCategory}")
        target_returns = self.bucket_to_target_returns[riskBucketCategory]
        df = self.get_daily_prices(tickers)
        mu = expected_returns.mean_historical_return(df)
        S = risk_models.sample_cov(df)
        max_return = mu.max()
        print(mu)
        print(S)
        print(max_return)
        target_returns = [r for r in target_returns if r <= max_return]
        if not target_returns:
            raise ValueError(f"No feasible target returns for bucket '{riskBucketCategory}'. Max return is {max_return:.4f}")
        best_sharpe = -float('inf')
        best_portfolio = None
        for target_return in target_returns:
            try:
                expected_return, expected_risk, allocations, sharpe_ratio = self.build_portfolio_for_return(mu, S, target_return)
                if sharpe_ratio > best_sharpe:
                    best_sharpe = sharpe_ratio
                    best_portfolio = {
                        "name": riskBucketCategory,
                        "riskBucket": riskBucketCategory,
                        "expectedReturn": expected_return,
                        "expectedRisk": expected_risk,
                        "allocations": allocations,
                    }
            except Exception as e:
                print(f"Optimization failed for target return {target_return}: {e}")
                continue
        if best_portfolio is None:
            raise ValueError("Failed to optimize portfolio for given inputs.")
        return Portfolio(**best_portfolio)