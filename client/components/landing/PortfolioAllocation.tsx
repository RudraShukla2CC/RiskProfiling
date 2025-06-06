'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, Plus, Loader2, Sparkles, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioAPI, validateStockSelection } from '@/lib/portfolioConstruction/portfolio';
import StockSelector from './StockSelector';

interface PortfolioAllocationProps {
  selectedRiskCategory: string;
  onPortfolioBuilt: (portfolio: any) => void;
}

// Category to ticker mapping
const CATEGORY_TICKER_MAP: Record<string, string> = {
  'Large Cap': 'SPY',
  'Mid Cap': 'IJH',
  'Small Cap': 'IWM',
  'Broad U.S. Bond Market': 'BND',
  'Gold': 'GLD',
  'Silver': 'SLV',
  'REIT ETF': 'VNQ',
  'Multi-Strategy Alternatives': 'FSMSX',
  'Alternative Strategies': 'LTAFX',
  'Quantified Alternatives': 'QALAX',
  'Goldman Sachs Multi-Strategy': 'GMAMX',
  'Alpha Alternative Assets': 'AAACX',
  'First Trust Alternative Opportunities': 'VFLEX',
  'New Alternatives': 'NALFX',
  'Cryptocurrency': 'BTC-USD',
};

// Ticker to category mapping (reverse lookup)
const TICKER_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TICKER_MAP).map(([category, ticker]) => [ticker, category])
);

export default function PortfolioAllocation({ 
  selectedRiskCategory, 
  onPortfolioBuilt 
}: PortfolioAllocationProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];

      // Convert categories to tickers for validation
      const tickers = newSelection.map(cat => CATEGORY_TICKER_MAP[cat]);
      const validation = validateStockSelection(tickers);
      
      if (!validation.isValid && newSelection.length > prev.length) {
        setError(validation.errors[0]);
        return prev;
      } else {
        setError(null);
        return newSelection;
      }
    });
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  // Excluded categories for Valura Exclusives
  const EXCLUDED_CATEGORIES = [
    'Multi-Strategy Alternatives',
    'Alternative Strategies', 
    'Quantified Alternatives',
    'Goldman Sachs Multi-Strategy',
    'Alpha Alternative Assets',
    'First Trust Alternative Opportunities',
    'New Alternatives'
  ];

  const handleValuraExclusives = async () => {
    // Set Valura Exclusives categories
    const allCategories = Object.keys(CATEGORY_TICKER_MAP);
    const valuraCategories = allCategories.filter(category => 
      !EXCLUDED_CATEGORIES.includes(category)
    );
    setSelectedCategories(valuraCategories);
    setError(null);

    // Convert categories to tickers for API call
    const tickers = valuraCategories.map(category => CATEGORY_TICKER_MAP[category]);
    const validation = validateStockSelection(tickers);
    
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoadingPortfolio(true);
    setError(null);

    try {
      const tickersString = tickers.join(' ');

      const request = {
        riskBucketCategory: selectedRiskCategory,
        tickers: tickersString,
      };
      
      const response = await portfolioAPI.buildPortfolio(request);
      
      // Convert ticker allocations back to categories
      const convertedResponse = {
        ...response,
        allocations: response.allocations.map((allocation: any) => ({
          ...allocation,
          category: TICKER_CATEGORY_MAP[allocation.ticker] || allocation.ticker,
        }))
      };
      
      onPortfolioBuilt(convertedResponse);
    } catch (e) {
      setError((e as Error).message || 'Failed to build portfolio');
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const handleBuildPortfolio = async () => {
    // Convert categories to tickers for API call
    const tickers = selectedCategories.map(category => CATEGORY_TICKER_MAP[category]);
    const validation = validateStockSelection(tickers);
    
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoadingPortfolio(true);
    setError(null);

    try {
      const tickersString = tickers.join(' ');

      const request = {
        riskBucketCategory: selectedRiskCategory,
        tickers: tickersString,
      };
      
      const response = await portfolioAPI.buildPortfolio(request);
      
      // Convert ticker allocations back to categories
      const convertedResponse = {
        ...response,
        allocations: response.allocations.map((allocation: any) => ({
          ...allocation,
          category: TICKER_CATEGORY_MAP[allocation.ticker] || allocation.ticker,
        }))
      };
      
      onPortfolioBuilt(convertedResponse);
    } catch (e) {
      setError((e as Error).message || 'Failed to build portfolio');
    } finally {
      setLoadingPortfolio(false);
    }
  };

  return (
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
              <h3 className="text-2xl font-bold text-gray-900">Portfolio Allocation</h3>
              <p className="text-sm text-gray-500">Search and select asset categories to create your personalized portfolio</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Valura Exclusives Button */}
            <div className="flex justify-center mb-6">
              <motion.button
                onClick={handleValuraExclusives}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingPortfolio}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Animated sparkles */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-2 left-4"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-2 right-6"
                    animate={{ 
                      rotate: [360, 0],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <Star className="h-3 w-3 text-yellow-200" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute top-1/2 right-3"
                    animate={{ 
                      y: [-2, 2, -2],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </motion.div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Button content */}
                <div className="relative flex items-center space-x-3 z-10">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                 <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent font-extrabold tracking-wide">
                    {loadingPortfolio ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                        Constructing Portfolio...
                      </>
                    ) : (
                      'Build using Valura Exclusives'
                    )}
                  </span>
                  <motion.div
                    animate={{ rotate: [0, -15, 15, 0] }}
                    transition={{ 
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="h-5 w-5" />
                  </motion.div>
                </div>

                {/* Pulse ring effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 group-hover:animate-pulse" />
              </motion.button>
            </div>

            {/* Category Selection */}
            <StockSelector
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
              onCategoryRemove={removeCategory}
              error={error}
            />

            {/* Build Portfolio Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleBuildPortfolio}
                disabled={loadingPortfolio || selectedCategories.length === 0}
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
                    Build Portfolio ({selectedRiskCategory})
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
