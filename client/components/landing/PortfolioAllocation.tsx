'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { portfolioAPI, validateStockSelection } from '@/lib/portfolioConstruction/portfolio';
import StockSelector from './StockSelector';

interface PortfolioAllocationProps {
  selectedRiskCategory: string;
  onPortfolioBuilt: (portfolio: any) => void;
}

export default function PortfolioAllocation({ 
  selectedRiskCategory, 
  onPortfolioBuilt 
}: PortfolioAllocationProps) {
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        riskBucketCategory: selectedRiskCategory, // Changed from riskToleranceScore
        tickers: tickersString,
      };
      
      const response = await portfolioAPI.buildPortfolio(request);
      onPortfolioBuilt(response);
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
              <p className="text-sm text-gray-500">Search and select assets to create your personalized portfolio</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Stock Selection */}
            <StockSelector
              selectedTickers={selectedTickers}
              onTickerToggle={toggleTicker}
              onTickerRemove={removeTicker}
              error={error}
            />

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