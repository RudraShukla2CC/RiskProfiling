// lib/portfolioAPI.ts

export interface StockAllocation {
  ticker: string;
  percentage: number;
}

export interface AllocationPieData {
  labels: string[];
  values: number[];
}

export interface PortfolioBuildRequest {
  riskBucketCategory: string;
  tickers: string;
}

export interface PortfolioBuildResponse {
  name: string;
  riskBucket: string;
  expectedReturn: number;
  expectedRisk: number;
  allocations: StockAllocation[];
  pieData: AllocationPieData;
}

export interface FinnhubSearchResult {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
}

const PORTFOLIO_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/portfolio';
const FINHUBIO = process.env.NEXT_PUBLIC_FINHUBIO || '';

class PortfolioAPI {
  private baseUrl: string;
  private finnhubApiKey: string;

  constructor(
    baseUrl: string = PORTFOLIO_API_BASE_URL,
    finnhubApiKey: string = FINHUBIO
  ) {
    this.baseUrl = baseUrl;
    this.finnhubApiKey = finnhubApiKey;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async searchStocks(query: string): Promise<FinnhubSearchResult> {
    try {
      console.log('Using Finnhub API key:', this.finnhubApiKey);
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${this.finnhubApiKey}`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return {
        count: data.count ?? 0,
        result: data.result ?? []
      };
    } catch (error) {
      console.error("Error searching stocks:", error);
      return {
        count: 0,
        result: []
      };
    }
  }

  async buildPortfolio(request: PortfolioBuildRequest): Promise<PortfolioBuildResponse> {
    try {
      console.log(request);
      const response = await fetch(`${this.baseUrl}/build`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      return this.handleResponse<PortfolioBuildResponse>(response);
    } catch (error) {
      console.error('Error building portfolio:', error);
      throw new Error('Failed to build portfolio. Please try again.');
    }
  }
}

export const portfolioAPI = new PortfolioAPI();

export const validateStockSelection = (tickers: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (tickers.length === 0) {
    errors.push('Please select at least one stock for your portfolio');
  }

  if (tickers.length > 10) {
    errors.push('Maximum 10 stocks allowed in portfolio');
  }

  const uniqueTickers = new Set(tickers);
  if (uniqueTickers.size !== tickers.length) {
    errors.push('Duplicate stocks found in selection');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default portfolioAPI;