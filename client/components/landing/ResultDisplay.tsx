'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Shield,
  TrendingUp,
  Download,
  RefreshCw,
  Search,
  CheckCircle,
  X,
  Plus,
  Target,
  Calendar,
  PieChart as PieChartIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScoreWithCategoryResponse } from '@/lib/riskProfiling/risk';
import { portfolioAPI, validateStockSelection } from '@/lib/portfolioConstruction/portfolio';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface FinnhubResultItem {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface ResultsDisplayProps {
  results: {
    tolerance: ScoreWithCategoryResponse;
    capacity: ScoreWithCategoryResponse;
  };
  onRestart: () => void;
}

const COLORS = ['#4f46e5', '#16a34a', '#f59e0b', '#dc2626', '#2563eb', '#db2777', '#d97706', '#059669'];

export default function ResultsDisplay({ results, onRestart }: ResultsDisplayProps) {
  const { tolerance, capacity } = results;
  const searchRef = useRef<HTMLInputElement>(null);

  // Finnhub search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FinnhubResultItem[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Portfolio build state
  const [period, setPeriod] = useState('20y');
  const [targetReturn, setTargetReturn] = useState<string>('');
  const [portfolio, setPortfolio] = useState<null | {
    name: string;
    riskBucket: string | number;
    expectedReturn: number;
    expectedRisk: number;
    allocations: { ticker: string; percentage: number }[];
  }>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Search stocks from Finnhub
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const data = await portfolioAPI.searchStocks(searchQuery.trim());
      setSearchResults(data.result || []);
      setShowSearchResults(true);
    } catch (e) {
      setError('Error searching tickers');
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Toggle ticker selection
  const toggleTicker = (symbol: string) => {
    setSelectedTickers(prev => {
      const newSelection = prev.includes(symbol)
        ? prev.filter(t => t !== symbol)
        : [...prev, symbol];

      // Validate selection
      const validation = validateStockSelection(newSelection);
      if (!validation.isValid && newSelection.length > prev.length) {
        setError(validation.errors[0]);
        return prev;
      } else {
        setError(null);
        return newSelection;
      }
    });
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const removeTicker = (symbol: string) => {
    setSelectedTickers(prev => prev.filter(t => t !== symbol));
  };

  const handleBuildPortfolio = async () => {
    const validation = validateStockSelection(selectedTickers);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoadingPortfolio(true);
    setError(null);

    try {
      const tickersString = selectedTickers.join(' ');

      const request = {
        riskToleranceScore: tolerance.totalScore,
        riskCapacityScore: capacity.totalScore,
        tickers: tickersString,
        period,
        targetReturn: targetReturn ? parseFloat(targetReturn) : undefined,
      };
      const response = await portfolioAPI.buildPortfolio(request);
      setPortfolio(response);
    } catch (e) {
      setError((e as Error).message || 'Failed to build portfolio');
      setPortfolio(null);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!portfolio) return;
    const report = `
Portfolio Analysis Report
Generated: ${new Date().toLocaleDateString()}

Risk Tolerance Score: ${tolerance.totalScore.toFixed(2)}
Risk Capacity Score: ${capacity.totalScore.toFixed(2)}

Portfolio Name: ${portfolio.name}
Risk Bucket: ${portfolio.riskBucket}
Expected Return: ${(portfolio.expectedReturn * 100).toFixed(2)}%
Expected Risk: ${(portfolio.expectedRisk * 100).toFixed(2)}%

Allocations:
${portfolio.allocations.map(a => `- ${a.ticker}: ${(a.percentage * 100).toFixed(2)}%`).join('\n')}

Disclaimer: This analysis is for informational purposes only.
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden py-8 px-6">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="max-w-6xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 mx-auto shadow-lg">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Risk Profile Results</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your assessment, here are your risk scores and personalized portfolio construction tool.
          </p>
        </motion.div>

        {/* Risk Scores */}
        <div className="grid gap-8 max-w-6xl mx-auto mb-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Shield className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Risk Tolerance</h3>
                    <p className="text-sm text-gray-500">Your emotional comfort with risk</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {tolerance.totalScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      Category: {tolerance.category || 'Moderate'}
                    </div>
                  </div>
                  <Progress
                    value={(tolerance.totalScore / 10) * 100}
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Risk Capacity</h3>
                    <p className="text-sm text-gray-500">Your financial ability to take risk</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {capacity.totalScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      Category: {capacity.category || 'Moderate'}
                    </div>
                  </div>
                  <Progress
                    value={(capacity.totalScore / 10) * 100}
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Portfolio Construction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Build Your Portfolio</h3>
                  <p className="text-sm text-gray-500">Search and select stocks to create your personalized portfolio</p>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Stock Search */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Search className="h-5 w-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Search Stocks & ETFs</label>
                  </div>

                  <div className="relative">
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search by ticker symbol or company name (e.g., AAPL, Apple)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-900 placeholder-gray-500"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {isSearching && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {showSearchResults && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-10 relative"
                      >
                        {searchResults.slice(0, 10).map((item, index) => (
                          <motion.button
                            key={item.symbol}
                            type="button"
                            onClick={() => toggleTicker(item.symbol)}
                            className={`w-full text-left p-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedTickers.includes(item.symbol) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                              }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{item.symbol}</div>
                                <div className="text-xs text-gray-500 truncate pr-2">
                                  {item.description}
                                </div>
                              </div>
                              {selectedTickers.includes(item.symbol) && (
                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected Tickers */}
                {selectedTickers.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <label className="text-sm font-medium text-gray-700">
                        Selected Stocks ({selectedTickers.length}/10)
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedTickers.map((ticker) => (
                        <motion.div
                          key={ticker}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                        >
                          <span>{ticker}</span>
                          <button
                            onClick={() => removeTicker(ticker)}
                            className="ml-2 hover:text-blue-900 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio Parameters */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Investment Period</label>
                    </div>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-900"
                    >
                      <option value="1y">1 Year</option>
                      <option value="5y">5 Years</option>
                      <option value="10y">10 Years</option>
                      <option value="20y">20 Years</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-gray-400" />
                      <label className="text-sm font-medium text-gray-700">Target Return (Optional)</label>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      placeholder="e.g., 0.12 for 12%"
                      value={targetReturn}
                      onChange={(e) => setTargetReturn(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Build Portfolio Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleBuildPortfolio}
                    disabled={loadingPortfolio || selectedTickers.length === 0}
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingPortfolio ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Constructing Portfolio...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Construct Portfolio
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Portfolio Results */}
        <AnimatePresence>
          {portfolio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-blue-100 shadow-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Portfolio Analysis</h3>
                      <p className="text-sm text-gray-500">Your optimized investment portfolio</p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Portfolio Stats */}
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                          <div className="text-sm text-blue-600 font-medium mb-1">Portfolio Name</div>
                          <div className="text-lg font-bold text-blue-900">{portfolio.name}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                          <div className="text-sm text-purple-600 font-medium mb-1">Risk Bucket</div>
                          <div className="text-lg font-bold text-purple-900">{portfolio.riskBucket}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                          <div className="text-sm text-green-600 font-medium mb-1">Expected Return</div>
                          <div className="text-lg font-bold text-green-900">
                            {(portfolio.expectedReturn * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                          <div className="text-sm text-orange-600 font-medium mb-1">Expected Risk</div>
                          <div className="text-lg font-bold text-orange-900">
                            {(portfolio.expectedRisk * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* Allocation List */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-900">Asset Allocation</h4>
                        <div className="space-y-2">
                          {portfolio.allocations.map(({ ticker, percentage }, index) => (
                            <div key={ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-medium text-gray-900">{ticker}</span>
                              </div>
                              <span className="font-bold text-gray-900">
                                {(percentage * 100).toFixed(2)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="flex flex-col items-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Visualization</h4>
                      <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={portfolio.allocations}
                              dataKey="percentage"
                              nameKey="ticker"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              innerRadius={40}
                              paddingAngle={2}
                              label={({ ticker, percent }) => `${ticker}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {portfolio.allocations.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                  stroke="#ffffff"
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Allocation']}
                              labelFormatter={(label: string) => `${label}`}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      className="px-6 py-3 font-medium border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Report
                    </Button>
                    <Button
                      onClick={onRestart}
                      className="px-6 py-3 font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Take Assessment Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}