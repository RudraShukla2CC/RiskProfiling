'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Search } from 'lucide-react';

interface StockItem {
  symbol: string;
  description: string;
  category: string;
}

interface StockSelectorProps {
  selectedTickers: string[];
  onTickerToggle: (symbol: string) => void;
  onTickerRemove: (symbol: string) => void;
  error?: string | null;
}

const STOCK_OPTIONS: StockItem[] = [
  { symbol: 'SPY', description: 'SPDR S&P 500 ETF Trust', category: 'Large Cap' },
  { symbol: 'IJH', description: 'iShares Core S&P Mid-Cap ETF', category: 'Mid Cap' },
  { symbol: 'IWM', description: 'iShares Russell 2000 ETF', category: 'Small Cap' },
  { symbol: 'BND', description: 'Vanguard Total Bond Market ETF', category: 'Broad U.S. Bond Market' },
  { symbol: 'GLD', description: 'SPDR Gold Shares ETF', category: 'Gold' },
  { symbol: 'SLV', description: 'iShares Silver Trust', category: 'Silver' },
  { symbol: 'VNQ', description: 'Vanguard Real Estate Index Fund ETF', category: 'REIT ETF' },
  { symbol: 'FSMSX', description: 'FS Multi-Strategy Alternatives Fund', category: 'Multi-Strategy Alternatives' },
  { symbol: 'LTAFX', description: 'Alternative Strategies Fund', category: 'Alternative Strategies' },
  { symbol: 'QALAX', description: 'Quantified Alternative Investment Fund', category: 'Quantified Alternatives' },
  { symbol: 'GMAMX', description: 'Goldman Sachs Multi-Strategy Alternatives Fund', category: 'Goldman Sachs Multi-Strategy' },
  { symbol: 'AAACX', description: 'Alpha Alternative Assets Fund', category: 'Alpha Alternative Assets' },
  { symbol: 'VFLEX', description: 'First Trust Alternative Opportunities Fund', category: 'First Trust Alternative Opportunities' },
  { symbol: 'NALFX', description: 'New Alternatives Fund', category: 'New Alternatives' },
  { symbol: 'BTC-USD', description: 'Bitcoin', category: 'Cryptocurrency'},
];

export default function StockSelector({ 
  selectedTickers, 
  onTickerToggle, 
  onTickerRemove, 
  error 
}: StockSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredStocks = STOCK_OPTIONS.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchFocus = () => setShowResults(true);
  const handleSearchBlur = () => setTimeout(() => setShowResults(false), 200);

  const handleTickerSelect = (symbol: string) => {
    onTickerToggle(symbol);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="space-y-4 relative z-[9999]">
      <div className="flex items-center space-x-2 mb-3">
        <Search className="h-5 w-5 text-gray-400" />
        <label className="text-sm font-medium text-gray-700">Search Stocks & ETFs</label>
      </div>

      <div className="relative overflow-visible">
        <input
          type="text"
          placeholder="Search by ticker symbol, name, or category (e.g., SPY, Gold, Bonds)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-900 placeholder-gray-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

        <AnimatePresence>
          {showResults && filteredStocks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto mt-1"
            >
              {filteredStocks.map((stock, index) => (
                <motion.button
                  key={stock.symbol}
                  type="button"
                  onClick={() => handleTickerSelect(stock.symbol)}
                  className={`w-full text-left p-4 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedTickers.includes(stock.symbol) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-500 truncate pr-2">{stock.description}</div>
                      <div className="text-xs text-blue-600 font-medium">{stock.category}</div>
                    </div>
                    {selectedTickers.includes(stock.symbol) && (
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedTickers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <label className="text-sm font-medium text-gray-700">
              Selected Assets ({selectedTickers.length}/10)
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
                  onClick={() => onTickerRemove(ticker)}
                  className="ml-2 hover:text-blue-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
        >
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
    </div>
  );
}
